import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type RawDeckForm, type Id, pageSchema } from '@pixis/schemas';
import { Deck } from './entities/deck.entity';
import { Equal, In, IsNull, Not, Or, type Repository } from 'typeorm';
import type { AuthPayload } from '../auth/dtos/auth.dtos';

import { getNextPage } from '@/common/utils/pagination.util';
import {
  FilterOperator,
  paginate,
  type PaginateConfig,
  type PaginateQuery,
} from 'nestjs-paginate';
import { SEARCHABLE_DECK_FIELDS, SORTABLE_DECK_FIELDS } from '@pixis/constants';
import { DataSource } from 'typeorm';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import type { FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { Collection } from '../collections/entities/collection.entity';
import { CollectionsService } from '../collections/collections.service';
import { log } from 'console';
type DeckIdWithUser = { deckId: number; user: AuthPayload };

const paginationOption: PaginateConfig<Deck> = {
  sortableColumns: [...SORTABLE_DECK_FIELDS],
  searchableColumns: [...SEARCHABLE_DECK_FIELDS],
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
    @InjectRepository(Deck) public deckRepo: Repository<Deck>,
    public dataSource: DataSource,
  ) {}

  async getSoftDeletedDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthPayload;
  }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .withDeleted()
      .where('deck.user.id = :userId AND deck.deletedAt IS NOT NULL', {
        userId: user.id,
      });
    const { data, links } = await paginate(query, qb, paginationOption);
    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }

  async getMyDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthPayload;
  }) {
    const qb = this.deckRepo.createQueryBuilder('deck');
    qb.where('deck.user.id = :userId', { userId: user.id });

    const qbWithJoins = this.populateDeckFields(qb);

    const { data, links } = await paginate(
      query,
      qbWithJoins,
      paginationOption,
    );

    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }

  async getDecks({ query }: { query: PaginateQuery }) {
    const qb = this.deckRepo.createQueryBuilder('deck');
    const qbWithJoins = this.populateDeckFields(qb);

    const { data, links } = await paginate(query, qbWithJoins, {
      ...paginationOption,
      filterableColumns: {
        ...paginationOption.filterableColumns,
        visibility: [],
      },
    });

    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }

  populateDeckFields(qb: SelectQueryBuilder<Deck>) {
    qb.leftJoinAndSelect('deck.user', 'user').loadRelationCountAndMap('deck.flashcardCount', 'deck.flashcards');
    return qb;
  }

  async createDeck({
    deckForm,
    user,
  }: {
    deckForm: RawDeckForm;
    user: AuthPayload;
  }) {
    const newDeck = this.deckRepo.create({
      ...deckForm,
      user: { id: user.id },
    });
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
      { id: deckId, user: { id: user.id } },
      deckForm,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Deck not found');
    }
    return result;
  }

  async getDeck({
    deckId,
    user,
    extend
  } : {
    user?: AuthPayload;
    deckId: number;
    extend?: (qb: SelectQueryBuilder<Deck>) => SelectQueryBuilder<Deck>
  }) {
    const qb = this.deckRepo.createQueryBuilder('deck').where('deck.id = :deckId', { deckId });
    
    const finalQb = extend ? extend(qb) : qb;
    const deck = await finalQb.getOne();

    if (!deck || (deck.visibility === 'private' && deck.userId !== user?.id)) {
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
      user: { id: user.id },
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
    const result = await this.deckRepo.restore({
      id: deckId,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Deck not found',
        code: 'DECK_NOT_FOUND',
      });
    }
    return result;
  }

  async deleteDeck({ deckId, user }: DeckIdWithUser) {
    const result = await this.deckRepo.delete({
      id: deckId,
      user: { id: user.id },
      deletedAt: Not(IsNull()),
    });
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
          user: { id: user.id },
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
          user: { id: user.id },
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
