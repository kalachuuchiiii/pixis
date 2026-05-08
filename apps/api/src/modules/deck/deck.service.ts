import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type RawDeckForm } from '@pixis/schemas';
import { Deck } from './entities/deck.entity';
import { In, IsNull, Not, type Repository } from 'typeorm';
import { getNextPage, getPaginationData } from '@/common/utils/pagination.util';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import type { SelectQueryBuilder } from 'typeorm';
import { deckPaginationConfig } from '@/config/paginationConfigs';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { withDeckSavedInfo } from './query/withDeckSavedInfo';
import { withDeckStats } from './query/withDeckStats';
import { Flashcard } from '../flashcard/entities/flashcard.entity.js';
import nestql from 'nestql';
type DeckIdWithUser = { deckId: number; user: AuthUser };

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(Deck) public deckRepo: Repository<Deck>,
    @InjectRepository(Flashcard) public flashcardRepo: Repository<Deck>,
    public dataSource: DataSource,
  ) {}

  async getLatestDecksAnsweredByUserId({ userId }: { userId: number }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.sessions', 'session')
      .leftJoin('session.user', 'user')
      .where(
        '(deck.user.id = :userId OR deck.visibility != :visibility) AND (user.id = :userId) AND user.isPrivate != :isPrivate',
        {
          userId,
          visibility: 'private',
          isPrivate: true,
        },
      )
      .orderBy('session.createdAt', 'DESC')
      .limit(3);

    const decks = await withDeckStats(qb).getMany();

    return decks;
  }

  async getSoftDeletedDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user: AuthUser;
  }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .withDeleted()
      .where('deck.user.id = :userId AND deck.deletedAt IS NOT NULL', {
        userId: user.id,
      });
    const qbWithCount = withDeckStats(qb);
    const result = await paginate(query, qbWithCount, deckPaginationConfig);
    return getPaginationData(result);
  }

  async findAccessibleDecks({
    query,
    user,
  }: {
    query: PaginateQuery;
    user?: AuthUser;
  }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.user', 'user');

    if (user) {
      qb.where('deck.user.id = :userId ', { userId: user.id });
    } else {
      qb.where('deck.visibility != :visibility', { visibility: 'private' });
    }

    const qbWithCount = withDeckStats(qb);

    const result = await paginate(query, qbWithCount, {
      ...deckPaginationConfig,

      filterableColumns: {
        ...deckPaginationConfig.filterableColumns,
        visibility: user
          ? deckPaginationConfig.filterableColumns?.visibility
          : [],
      },
    });

    return getPaginationData(result);
  }

  async createDeck({
    deckForm,
    user,
  }: {
    deckForm: RawDeckForm;
    user: AuthUser;
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
    user: AuthUser;
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

  async findAccessibleDeckById({
    deckId,
    user,
    throwOnNotFound = false,
  }: {
    user: AuthUser;
    deckId: number;
    throwOnNotFound?: boolean;
  }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.user', 'user')
      .leftJoin('deck.flashcards', 'flashcard')
      .where('deck.id = :deckId', { deckId })
      .withDeleted()
      .andWhere('(deck.visibility != :visibility OR user.id = :userId)', {
        visibility: 'private',
        userId: user.id,
      });

    const finalQb = withDeckSavedInfo({
      qb: withDeckStats(qb),
      userId: user.id,
    })
      .leftJoin('deck.sessions', 'session')
      .leftJoin('session.user', 'suser')
      .select([
        'deck',
        'user.username',
        'user.nickname',
        'user.avatarPublicUrl',
      ])
      .addSelect('AVG(session.accuracy)::float', 'deck_average_accuracy')
      .addSelect('COUNT(DISTINCT suser.id)::int', 'deck_participants_count')
      .addSelect('COUNT(DISTINCT flashcard.id)::int', 'deck_flashcard_count')
      .groupBy('deck.id')
      .addGroupBy('usd.id')
      .addGroupBy('user.id');

    const deck = await finalQb.getRawOne();
    const nestedDeck = {
      ...nestql(deck, { prefix: 'deck' }),
      user: nestql(deck, { prefix: 'user' }),
    };

    if (!deck && throwOnNotFound) {
      throw new NotFoundException({
        message: 'Deck not found',
        code: 'DECK_NOT_FOUND',
      });
    }
    return nestedDeck;
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

  async deleteDecks({ deckIds, user }: { deckIds: number[]; user: AuthUser }) {
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

  async restoreDecks({ deckIds, user }: { deckIds: number[]; user: AuthUser }) {
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
