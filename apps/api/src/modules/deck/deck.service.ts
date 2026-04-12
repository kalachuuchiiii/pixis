import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { RawDeckForm, Id } from '@pixis/schemas';
import { Deck } from './entities/deck.entity';
import {
  Brackets,
  ILike,
  IsNull,
  Not,
  type FindManyOptions,
  type Repository,
} from 'typeorm';
import type { AuthPayload } from '../auth/dtos/auth.dtos';

import { getNextPage } from '@/common/utils/pagination.util';

import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { FilterOperator, paginate, type PaginateConfig, type PaginateQuery } from 'nestjs-paginate';
import { SORTABLE_DECK_FIELDS } from '@pixis/constants';
type DeckIdWithUser = { deckId: number; user: AuthPayload };

const paginationOption: PaginateConfig<Deck> = {
      sortableColumns: [...SORTABLE_DECK_FIELDS],
      searchableColumns: ['topic', 'title', 'description'],
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.EQ],
        updatedAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.EQ],
        visibility: [FilterOperator.EQ]
      },
      defaultLimit: 10,
      defaultSortBy: [['createdAt', 'DESC']]
    }

@Injectable()
export class DeckService extends TypeOrmCrudService<Deck> {
  constructor(
    @InjectRepository(Deck) private readonly deckRepo: Repository<Deck>,
  ) {
    super(deckRepo);
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
    const { data } = await paginate(query, qb, paginationOption);
    return getNextPage(data, query.limit ?? 10, query.page ?? 1)
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
      .leftJoinAndSelect('deck.user', 'user')
      .where('deck.id = :id AND deck.userId = :userId', {
        id: deckId,
        userId: user.id,
      })
      .select([
        'deck',
        'user.username',
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
}
