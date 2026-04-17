import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { IsNull, Not, type Repository, type SelectQueryBuilder } from 'typeorm';
import type { CollectionForm } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import {
  FilterOperator,
  paginate,
  type PaginateConfig,
  type PaginateQuery,
} from 'nestjs-paginate';
import { getNextPage } from '@/common/utils/pagination.util';

type CollectionIdWithUser = {
  collectionId: number;
  user: AuthPayload;
};

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) public collectionRepo: Repository<Collection>,
  ) {}

  paginateOption(
    { disabledVisibility }: { disabledVisibility: boolean } = {
      disabledVisibility: true,
    },
  ) {
    return {
      sortableColumns: ['createdAt', 'updatedAt'],
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.BTW],
        visibility: disabledVisibility ? [] : [FilterOperator.EQ],
      },
      searchableColumns: ['name'],
    } as PaginateConfig<Collection>;
  }

  async createCollection({
    collectionForm,
    user,
  }: {
    collectionForm: CollectionForm;
    user: AuthPayload;
  }) {
    const newCollection = this.collectionRepo.create({
      ...collectionForm,
      userId: user.id,
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
      { id: collectionId, userId: user.id },
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

  async softDeleteCollection({ collectionId, user }: CollectionIdWithUser) {
    const result = await this.collectionRepo.softDelete({
      id: collectionId,
      userId: user.id,
      deletedAt: IsNull(),
    });
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
      userId: user.id,
      deletedAt: Not(IsNull()),
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }
    return result;
  }

  async restoreCollection({ collectionId, user }: CollectionIdWithUser) {
    const result = await this.collectionRepo.restore({
      id: collectionId,
      userId: user.id,
      deletedAt: Not(IsNull()),
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Collection not found',
        code: 'COLLECTION_NOT_FOUND',
      });
    }
    return result;
  }

  async getCollections({ query }: { query: PaginateQuery }) {
    const qb = this.collectionRepo.createQueryBuilder('collection');

    const qbWithJoins = this.populateCollectionFields(qb);

    const { data, links, meta } = await paginate(
      query,
      qbWithJoins,
      this.paginateOption(),
    );

    return {
      data,
      nextPage: getNextPage(links),
      totalItems: meta.totalItems,
    };
  }

  async getMyCollections({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthPayload;
  }) {
    const qb = this.collectionRepo
      .createQueryBuilder('collection')
      .where('collection.userId = :userId', { userId: user.id });

    const qbWithJoins = this.populateCollectionFields(qb);

    const { data, links, meta } = await paginate(
      query,
      qbWithJoins,
      this.paginateOption({ disabledVisibility: false }),
    );

    return {
      data,
      nextPage: getNextPage(links),
      totalItems: meta.totalItems,
    };
  }

  populateCollectionFields(qb: SelectQueryBuilder<Collection>) {
    qb.leftJoinAndSelect('collection.user', 'user')
      .loadRelationCountAndMap('collection.deckCount', 'collection.decks')
      .select([
        'collection',
        'user.username',
        'user.nickname',
        'user.avatarPublicUrl',
      ]);
    return qb;
  }
}
