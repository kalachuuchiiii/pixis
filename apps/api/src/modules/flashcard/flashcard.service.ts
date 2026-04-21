import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FlashcardForm, Query } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Deck } from '../deck/entities/deck.entity';
import type { Repository } from 'typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { FilterOperator, paginate, type PaginateQuery } from 'nestjs-paginate';
import type { SelectQueryBuilder } from 'typeorm/browser';
import {
  SEARCHABLE_FLASHCARD_FIELDS,
  SORTABLE_FLASHCARD_FIELDS,
} from '@pixis/constants';
import { getNextPage } from '@/common/utils/pagination.util';
import { DeckService } from '../deck/deck.service';

type FlashcardIdAndUser = { flashcardId: number; user: AuthPayload };

@Injectable()
export class FlashcardService {
  constructor(
    @InjectRepository(Deck) private deckRepo: Repository<Deck>,
    @InjectRepository(Flashcard)
    private flashcardRepo: Repository<Flashcard>,
    public readonly deckService: DeckService
  ) {}

  addAnalytics(queryBuilder: SelectQueryBuilder<Flashcard>) {
    queryBuilder
      .select([
        'flashcard.id',
        'flashcard.question',
        'flashcard.user.id',
        'flashcard.deck.id',
        'flashcard.answer',
        'flashcard.type',
        'flashcard.createdAt',
        'flashcard.updatedAt',
        'flashcard.choices',
        'flashcard.isAnswerCaseSensitive',
      ])
      .addSelect('COALESCE(SUM(progress.repetitions), 0)', 'totalRepetitions')
      .addSelect('COALESCE(SUM(progress.lapses), 0)', 'totalLapses')
      .addSelect('COALESCE(AVG(progress.easeFactor), 0)', 'avgEaseFactor')
      .addSelect(
        'COALESCE(SUM(CASE WHEN progress.lastRating = 1 THEN 1 ELSE 0 END), 0)',
        'hardRatingCount',
      )
      .addSelect(
        'COALESCE(SUM(CASE WHEN progress.lastRating = 2 THEN 1 ELSE 0 END), 0)',
        'goodRatingCount',
      )
      .addSelect(
        'COALESCE(SUM(CASE WHEN progress.lastRating = 3 THEN 1 ELSE 0 END), 0)',
        'easyRatingCount',
      )
      .groupBy('flashcard.id');
    return queryBuilder;
  }

  async createFlashcard({
    deckId,
    user,
    flashcardForm,
  }: {
    deckId: number;
    flashcardForm: FlashcardForm;
    user: AuthPayload;
  }) {
    const myDeck = await this.deckRepo.findOne({
      where: { id: deckId, user: { id: user.id }},
      withDeleted: true,
    });
    if (!myDeck) {
      throw new ForbiddenException({
        message: 'This deck is not yours.',
        code: 'DECK_NOT_YOURS',
      });
    }

    const newFlashcard = this.flashcardRepo.create({
      ...flashcardForm,
      user: { id:  user.id },
      deck: { id:  myDeck.id }
    });
    return await this.flashcardRepo.save(newFlashcard);
  }

  async getFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const flashcard = await this.flashcardRepo.findOne({
      where: { id: flashcardId, userId: user.id },
      withDeleted: true,
    });
    if (!flashcard) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    console.log(flashcard)
    return flashcard;
  }

  async updateFlashcard({
    flashcardId,
    user,
    flashcardForm,
  }: {
    flashcardId: number;
    user: AuthPayload;
    flashcardForm: FlashcardForm;
  }) {
    const result = await this.flashcardRepo.update(
      { id: flashcardId, user: { id: user.id } },
      { ...flashcardForm, updatedAt: new Date() },
    );
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }

  async softDeleteFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const result = await this.flashcardRepo.softDelete({
      id: flashcardId,
      user: { id: user.id }
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }

  async restoreFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const result = await this.flashcardRepo.restore({
      id: flashcardId,
      user: { id: user.id }
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }

  async getFlashcards({
    deckId,
    query,
    user,
    extend,
  }: {
    deckId: number;
    user?: AuthPayload;
    query: PaginateQuery;
    extend?: (
      query: SelectQueryBuilder<Flashcard>,
    ) => SelectQueryBuilder<Flashcard>;
  }) {
    const deck = await this.deckService.getDeck({ deckId, user, extend: (qb) => qb.withDeleted() })
    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .where('flashcard.deck.id = :deckId', { deckId });

    const {
      data,
      links,
      meta: { totalItems },
    } = await paginate(query, extend ? extend(qb) : qb, {
      sortableColumns: [...SORTABLE_FLASHCARD_FIELDS],
      filterableColumns: {
        type: [FilterOperator.EQ],
        createdAt: [FilterOperator.EQ, FilterOperator.GTE],
      },
      searchableColumns: [...SEARCHABLE_FLASHCARD_FIELDS],
    });
    console.log(data);
    return {
      data,
      totalItems,
      nextPage: getNextPage(links, query.page),
    };
  }

  async deleteFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const result = await this.flashcardRepo.delete({
      id: flashcardId,
      user: { id: user.id }
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }
}
