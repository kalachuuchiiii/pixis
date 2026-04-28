import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import {
  IsNull,
  Not,
  type FindOneOptions,
  type Repository,
  type SelectQueryBuilder,
} from 'typeorm';
import type { CollectionForm } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import {
  FilterOperator,
  paginate,
  type PaginateConfig,
  type PaginateQuery,
} from 'nestjs-paginate';
import { getNextPage } from '@/common/utils/pagination.util';
import { SORTABLE_COLLECTION_FIELDS } from '@pixis/constants';
import { CollectionDeck } from '../collection-deck/entities/collection-deck.entity';
import { options } from 'axios';
import { collectionPaginationConfig } from '@/config/pagination.config';

type CollectionIdWithUser = {
  collectionId: number;
  user: AuthPayload;
};

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) public collectionRepo: Repository<Collection>,
  ) {}

  async createCollection({
    collectionForm,
    user,
  }: {
    collectionForm: CollectionForm;
    user: AuthPayload;
  }) {
    const newCollection = this.collectionRepo.create({
      ...collectionForm,
      user: { id: user.id },
    });
    const result = await this.collectionRepo.save(newCollection);
    return result;
  }

  async updateCollection({
    collectionForm,
    collectionId,
    user,
  }: {
    collectionForm: CollectionForm;
    collectionId: number;
    user: AuthPayload;
  }) {
    const result = await this.collectionRepo.update(
      { id: collectionId, user: { id: user.id } },
      collectionForm,
    );
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }
    return result;
  }

  async deleteCollection({ collectionId, user }: CollectionIdWithUser) {
    const result = await this.collectionRepo.delete({
      id: collectionId,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }
    return result;
  }

  async getPublicCollections({ query }: { query: PaginateQuery }) {
    const qb = this.findAccessibleCollectionsQuery({});

    const { data, links, meta } = await paginate(query, qb, {
      ...collectionPaginationConfig,
      filterableColumns: {
        ...collectionPaginationConfig.filterableColumns,
        visibility: [],
      },
    });

    return {
      data,
      nextPage: getNextPage(links),
      totalItems: meta.totalItems,
    };
  }

  async findAccessibleCollectionById({
    collectionId,
    user,
    throwErrorOnNotFound = true,
  }: {
    collectionId: number;
    throwErrorOnNotFound?: boolean;
    user: AuthPayload;
  }) {
    const qb = this.collectionRepo
      .createQueryBuilder('collection')
      .where('collection.id = :collectionId', { collectionId })
      .andWhere(
        '(collection.user.id = :userId OR collection.visibility != :visibility)',
        { visibility: 'private', userId: user.id },
      )
      .leftJoinAndSelect('collection.user', 'user')
      .leftJoinAndMapOne(
        'collection.userSavedCollection',
        'collection.userSavedCollections',
        'usc',
        'usc.user.id = :userId',
        { userId: user.id },
      ).loadRelationCountAndMap(
        'collection.deckCount',
        'collection.collectionDecks'
      ).loadRelationCountAndMap(
        'collection.userSavedCollectionCount',
        'collection.userSavedCollections'
      )
      .select([
        'collection',
        'usc.id',
        'user.username',
        'user.nickname',
        'user.avatarPublicUrl',
      ]);

    const result = await qb.getOne();
    console.log(result);
    if (!result && throwErrorOnNotFound) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }

    return result;
  }

  findAccessibleCollectionsQuery({ user = undefined }: { user?: AuthPayload }) {
    return this.collectionRepo
      .createQueryBuilder('collection')
      .where(
        '(collection.user.id = :userId OR collection.visibility != :visibility)',
        { userId: user?.id, visibility: 'private' },
      )
      .leftJoinAndSelect('collection.user', 'user')
      .loadRelationCountAndMap(
        'collection.deckCount',
        'collection.collectionDecks',
      )
      .loadRelationCountAndMap(
        'collection.userSavedCollectionCount',
        'collection.userSavedCollections'
      )
      .select([
        'collection',
        'user.username',
        'user.nickname',
        'user.avatarPublicUrl',
      ]);
  }

  async getMyCollections({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthPayload;
  }) {
    const qb = this.findAccessibleCollectionsQuery({ user }).andWhere('collection.user.id = :userId', { userId: user.id });

    const { data, links, meta } = await paginate(
      query,
      qb,
      collectionPaginationConfig,
    );

    return {
      data,
      nextPage: getNextPage(links),
      totalItems: meta.totalItems,
    };
  }
}
