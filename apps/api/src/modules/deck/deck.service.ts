import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type RawDeckForm, type Id, pageSchema } from '@pixis/schemas';
import { Deck } from './entities/deck.entity';
import {
  Brackets,
  ILike,
  In,
  IsNull,
  Not,
  type FindManyOptions,
  type Repository,
} from 'typeorm';
import type { AuthPayload } from '../auth/dtos/auth.dtos';

import { getNextPage } from '@/common/utils/pagination.util';
import {
  FilterOperator,
  paginate,
  type PaginateConfig,
  type PaginateQuery,
} from 'nestjs-paginate';
import { SORTABLE_DECK_FIELDS } from '@pixis/constants';
import { DataSource } from 'typeorm';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { log } from 'console';
type DeckIdWithUser = { deckId: number; user: AuthPayload };

const paginationOption: PaginateConfig<Deck> = {
  sortableColumns: [...SORTABLE_DECK_FIELDS],
  searchableColumns: ['topic', 'title', 'description'],
  filterableColumns: {
    createdAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
    updatedAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.EQ],
    visibility: [FilterOperator.EQ],
  },
  defaultLimit: 10,
  defaultSortBy: [['createdAt', 'DESC']],
};

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(Deck) private readonly deckRepo: Repository<Deck>,
    public dataSource: DataSource,
  ) {}

  async getSoftDeletedDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthPayload;
  }) {
    console.log('Soft deltedddddd');

    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .withDeleted()
      .where('deck.userId = :userId AND deck.deletedAt IS NOT NULL', {
        userId: user.id,
      });
    const { data, links } = await paginate(query, qb, paginationOption);
    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }
  async getDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user?: AuthPayload;
  }) {
    const qb = this.deckRepo.createQueryBuilder('deck');

    if (user) {
      qb.where('deck.userId = :userId', { userId: user.id });
    }

    qb.leftJoinAndSelect('deck.user', 'user').leftJoinAndMapOne(
      'deck.flashcardPreview',
      Flashcard,
      'flashcard',
      'flashcard.deckId = deck.id',
    ).select(['deck', 'user.username', 'user.nickname', 'user.avatarPublicUrl', 'flashcard.question', 'flashcard.type']);

    const { data, links } = await paginate(query, qb, paginationOption);

    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }

  async createDeck({
    deckForm,
    user,
  }: {
    deckForm: RawDeckForm;
    user: AuthPayload;
  }) {
    const newDeck = this.deckRepo.create({ ...deckForm, userId: user.id });
    return await this.deckRepo.save(newDeck);
  }

  async updateDeck({
    deckForm,
    deckId,
    user,
  }: {
    deckId: number;
    deckForm: RawDeckForm;
    user: AuthPayload;
  }) {
    const result = await this.deckRepo.update(
      { id: deckId, userId: user.id },
      deckForm,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Deck not found');
    }
    return result;
  }

  async getDeckById({ deckId, user }: DeckIdWithUser) {
    const deck = await this.deckRepo
      .createQueryBuilder('deck')
      .withDeleted()
      .leftJoinAndSelect('deck.user', 'user')
      .where('deck.id = :id AND deck.userId = :userId', {
        id: deckId,
        userId: user.id,
      })
      .select([
        'deck',
        'user.username',
        'user.id',
        'user.nickname',
        'user.avatarPublicUrl',
      ])
      .getOne();

    if (!deck) {
      throw new NotFoundException({
        message: 'Deck not found.',
        code: 'DECK_NOT_FOUND',
      });
    }
    return deck;
  }

  async softDeleteDeck({ deckId, user }: DeckIdWithUser) {
    const result = await this.deckRepo.softDelete({
      id: deckId,
      userId: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Deck not found',
        code: 'DECK_NOT_FOUND',
      });
    }
    return result;
  }

  async restoreDeck({ deckId, user }: DeckIdWithUser) {
    const result = await this.deckRepo.restore({ id: deckId, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Deck not found',
        code: 'DECK_NOT_FOUND',
      });
    }
    return result;
  }

  async deleteDeck({ deckId, user }: DeckIdWithUser) {
    const result = await this.deckRepo.delete({ id: deckId, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Deck not found',
        code: 'DECK_NOT_FOUND',
      });
    }
    return result;
  }

  async deleteDecks({
    deckIds,
    user,
  }: {
    deckIds: number[];
    user: AuthPayload;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Deck);

      const existing = await repo.find({
        where: {
          id: In(deckIds),
          userId: user.id,
          deletedAt: Not(IsNull()),
        },
        select: ['id'],
        withDeleted: true,
      });

      if (existing.length !== deckIds.length) {
        throw new NotFoundException({
          message: 'Some decks were not found or not owned by user',
        });
      }

      const result = await repo.delete({ id: In(deckIds) });

      return result;
    });
  }

  async restoreDecks({
    deckIds,
    user,
  }: {
    deckIds: number[];
    user: AuthPayload;
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Deck);

      const existing = await repo.find({
        where: {
          id: In(deckIds),
          userId: user.id,
          deletedAt: Not(IsNull()),
        },
        select: ['id'],
        withDeleted: true,
      });

      if (existing.length !== deckIds.length) {
        throw new NotFoundException({
          message: 'Some decks were not found or not owned by user',
        });
      }

      const result = await repo.restore({ id: In(deckIds) });

      return result;
    });
  }
}
