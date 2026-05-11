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
import {
  FilterOperator,
  paginate,
  type PaginateConfig,
  type PaginateQuery,
} from 'nestjs-paginate';
import { getNextPage, getPaginationData } from '@/common/utils/pagination.util';
import { SORTABLE_COLLECTION_FIELDS } from '@pixis/constants';
import { CollectionDeck } from '../collection-deck/entities/collection-deck.entity';
import { options } from 'axios';
import { collectionPaginationConfig } from '@/config/paginationConfigs';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { withCollectionStats } from './query/withCollectionStats';

type CollectionIdWithUser = {
  collectionId: number;
  user: AuthUser;
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
    user: AuthUser;
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
    user: AuthUser;
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

  async findAccessibleCollectionById({
    collectionId,
    user,
    throwErrorOnNotFound = true,
  }: {
    collectionId: number;
    throwErrorOnNotFound?: boolean;
    user: AuthUser;
  }) {
    const qb = withCollectionStats(
      this.collectionRepo
        .createQueryBuilder('collection')
        .where('collection.id = :collectionId', { collectionId })
        .andWhere(
          '(collection.user.id = :userId OR collection.visibility != :visibility)',
          { visibility: 'private', userId: user.id },
        )
        .leftJoinAndMapOne(
          'collection.userSavedCollection',
          'collection.userSavedCollections',
          'usc',
          'usc.user.id = :userId',
          { userId: user.id },
        )
        .leftJoinAndSelect('collection.user', 'user'),
    ).select([
      'collection',
      'usc.id',
      'user.username',
      'user.nickname',
      'user.avatarUrl',
      'user.id',
    ]);

    const result = await qb.getOne();
    if (!result && throwErrorOnNotFound) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }

    return result;
  }

  async findAccessibleCollectionsByUserId({
    query,
    user,
    userId,
  }: {
    user: AuthUser;
    query: PaginateQuery;
    userId: number;
  }) {
    const qb = this.collectionRepo
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.user', 'user')
      .where(
        'user.id = :userId AND (collection.visibility != :visibility OR user.id = :myId)',
        { userId, myId: user.id, visibility: 'private' },
      );

    const finalQb = withCollectionStats(qb).select([
      'collection',
      'user.username',
      'user.id',
      'user.nickname',
      'user.avatarUrl',
    ]);

    const result = await paginate(
      query,
      finalQb,
      user.id === userId
        ? collectionPaginationConfig
        : {
            ...collectionPaginationConfig,
            filterableColumns: {
              ...collectionPaginationConfig.filterableColumns,
              visibility: [],
            },
          },
    );
    return getPaginationData(result);
  }

  async findAccessibleCollections({
    query,
    user,
  }: {
    query: PaginateQuery;
    user?: AuthUser;
  }) {
    const baseQb = this.collectionRepo
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.user', 'user');

    if (user) {
      baseQb.where('(collection.user.id = :userId)', {
        userId: user?.id,
      });
    } else {
      baseQb.where('(collection.visibility != :visibility)', {
        visibility: 'private',
      });
    }

    const qb = withCollectionStats(baseQb).select([
      'collection',
      'user.username',
      'user.id',
      'user.nickname',
      'user.avatarUrl',
    ]);

    const result = await paginate(
      query,
      qb,
      user
        ? collectionPaginationConfig
        : {
            ...collectionPaginationConfig,
            filterableColumns: {
              ...collectionPaginationConfig.filterableColumns,
              visibility: [],
            },
          },
    );
    return getPaginationData(result);
  }
}
