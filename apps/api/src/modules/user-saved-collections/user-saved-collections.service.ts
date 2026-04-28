import {
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '../collections/entities/collection.entity';
import { Equal, Not, Repository } from 'typeorm';
import type { Request } from 'express';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { UserSavedCollection } from './entities/user-saved-collection.entity';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { collectionPaginationConfig } from '@/config/pagination.config';
import { getNextPage } from '@/common/utils/pagination.util';

type CollectionIDWithUser = { collectionId: number; user: AuthPayload };

@Injectable()
export class UserSavedCollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    @InjectRepository(UserSavedCollection)
    private readonly userSavedCollectionRepo: Repository<UserSavedCollection>,
  ) {}

  async isCollectionAlreadySaved({ collectionId, user }: CollectionIDWithUser) {
    return await this.userSavedCollectionRepo.exists({
      where: {
        collection: [
          { id: collectionId, user: { id: user.id } },
          { id: collectionId, visibility: Not(Equal('private')) },
        ],
      },
    });
  }

  async create({ collectionId, user }: CollectionIDWithUser) {
    const created = await this.userSavedCollectionRepo.create({
      user: { id: user.id },
      collection: { id: collectionId },
    });
    return await this.userSavedCollectionRepo.save(created);
  }

  async saveCollection({ collectionId, user }: CollectionIDWithUser) {
    const isSaved = await this.isCollectionAlreadySaved({ collectionId, user });
    if (isSaved) {
      throw new ConflictException({
        message: 'This collection is already saved',
        code: 'ALREADY_SAVED_COLLECTION',
      });
    }

    return await this.create({ collectionId, user });
  }

  async unsaveCollection({ collectionId, user }: CollectionIDWithUser) {
    const result = await this.userSavedCollectionRepo.delete({
      collection: { id: collectionId },
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Saved Collection not found',
        code: 'SAVED_COLLECTION_NOT_FOUND',
      });
    }
    return result;
  }

   findAccessibleSavedCollection({ user = undefined }:{user?: AuthPayload } = {}){
    return this.collectionRepo
      .createQueryBuilder('collection')
      .where(
        '(collection.user.id = :userId OR collection.visibility != :visibility)',
        { userId: user?.id, visibility: 'private' },
      ).leftJoin('collection.userSavedCollections', 'usc')
      .where('usc.user.id = :userId', { userId: user?.id })
      .leftJoinAndSelect('collection.user', 'user')
      .loadRelationCountAndMap('collection.userSavedCollectionCount', 'collection.userSavedCollections')
      .loadRelationCountAndMap('collection.deckCount', 'collection.collectionDecks')

  }

  async getSavedCollections({
    user,
    query,
  }: {
    user: AuthPayload;
    query: PaginateQuery;
  }) {
    const qb = this.findAccessibleSavedCollection({ user }).select(['collection', 'user.nickname', 'user.username', 'user.avatarPublicUrl']);
    const { data, links, meta: { totalItems } } = await paginate(query, qb, collectionPaginationConfig)
    return {
       data,
       nextPage: getNextPage(links),
       totalItems
    }
  }
}
