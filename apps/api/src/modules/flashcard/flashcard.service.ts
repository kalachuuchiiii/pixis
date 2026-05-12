import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FlashcardForm } from '@pixis/schemas';
import { InjectRepository } from '@nestjs/typeorm';
import { Deck } from '../deck/entities/deck.entity';
import { Equal, In, Not, type Repository } from 'typeorm';
import { Flashcard } from './entities/flashcard.entity';
import {
  FilterOperator,
  paginate,
  Select,
  type PaginateQuery,
} from 'nestjs-paginate';
import type {
  DeepPartial,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsSelectByString,
  SelectQueryBuilder,
} from 'typeorm';
import {
  SEARCHABLE_FLASHCARD_FIELDS,
  SORTABLE_FLASHCARD_FIELDS,
} from '@pixis/constants';
import { getNextPage, getPaginationData } from '@/common/utils/pagination.util';
import { DeckService } from '../deck/deck.service';
import type { AuthUser } from '../auth/schemas/auth.schemas';

type FlashcardIdAndUser = { flashcardId: number; user: AuthUser };

@Injectable()
export class FlashcardService {
  constructor(
    @InjectRepository(Deck) private deckRepo: Repository<Deck>,
    @InjectRepository(Flashcard)
    private flashcardRepo: Repository<Flashcard>,
    public readonly deckService: DeckService,
  ) {}

  async createFlashcard({
    deckId,
    user,
    flashcardForm,
  }: {
    deckId: number;
    flashcardForm: FlashcardForm;
    user: AuthUser;
  }) {
    const myDeck = await this.deckRepo.findOne({
      where: { id: deckId, user: { id: user.id } },
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
      user: { id: user.id },
      deck: { id: myDeck.id },
    });
    return await this.flashcardRepo.save(newFlashcard);
  }

  async findAccessibleFlashcardById({ flashcardId, user }: FlashcardIdAndUser) {
    const flashcard = await this.flashcardRepo.findOne({
      where: [
        { id: flashcardId, user: { id: user.id } },
        { id: flashcardId, deck: { visibility: Not(Equal('private')) } },
      ],

      withDeleted: true,
    });
    if (!flashcard) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return flashcard;
  }

  async updateFlashcard({
    flashcardId,
    user,
    flashcardForm,
  }: {
    flashcardId: number;
    user: AuthUser;
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

  async findAccessibleFlashcardsByDeckId({
    deckId,
    query,
    user,
    extend,
  }: {
    deckId: number;
    user: AuthUser;
    query: PaginateQuery;
    extend?: (
      query: SelectQueryBuilder<Flashcard>,
    ) => SelectQueryBuilder<Flashcard>;
  }) {
    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .withDeleted()
      .leftJoin('flashcard.deck', 'deck')
      .where('deck.id = :deckId', { deckId })
      .andWhere('(deck.visibility != :visibility OR deck.user.id = :userId)', {
        visibility: 'private',
        userId: user.id,
      });

    const result = await paginate(query, extend ? extend(qb) : qb, {
      sortableColumns: [...SORTABLE_FLASHCARD_FIELDS],
      filterableColumns: {
        type: [FilterOperator.EQ],
        createdAt: [FilterOperator.EQ, FilterOperator.GTE],
      },
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: [...SEARCHABLE_FLASHCARD_FIELDS],
    });
    return getPaginationData(result);
  }

  async deleteFlashcardById({ flashcardId, user }: FlashcardIdAndUser) {
    const result = await this.flashcardRepo.delete({
      id: flashcardId,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }

  async findAccessibleFlashcardsByIds({
    flashcardIds,
    user,
    options = {},
  }: {
    flashcardIds: number[];
    user: AuthUser;
    options?: FindManyOptions<Flashcard> | undefined;
  }) {
    const flashcards = await this.flashcardRepo.find({
      where: {
        deck: [
          { visibility: Not(Equal('private')) },
          { user: { id: user.id } },
        ],
        id: In(flashcardIds),
      },
      ...options,
    });

    const isFullMatch = flashcards.length === flashcardIds.length;
    return {
      flashcards,
      isFullMatch,
    };
  }
}
