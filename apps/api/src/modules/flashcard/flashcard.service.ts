import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Flashcard, FlashcardForm, Query } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Deck } from '../deck/entities/deck.entity';
import type { Repository } from 'typeorm';
import { Flashcard as FlashcardEntity } from './entities/flashcard.entity';

type FlashcardIdAndUser = { flashcardId: number; user: AuthPayload };

@Injectable()
export class FlashcardService {
  constructor(
    @InjectRepository(Deck) private deckRepo: Repository<Deck>,
    @InjectRepository(FlashcardEntity)
    private flashcardRepo: Repository<FlashcardEntity>,
  ) {}

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
      where: { id: deckId, userId: user.id },
    });
    if (!myDeck) {
      throw new ForbiddenException({
        message: 'This deck is not yours.',
        code: 'DECK_NOT_YOURS',
      });
    }

    const newFlashcard = this.flashcardRepo.create({
      ...flashcardForm,
      userId: user.id,
      deckId: myDeck.id,
    });
    return await this.flashcardRepo.save(newFlashcard);
  }

  async getDeckFlashcards({
    deckId,
    params,
    user,
  }: {
    deckId: number;
    user: AuthPayload;
    params: Query;
  }) {
  
  
  }

  async getFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const flashcard = await this.flashcardRepo.findOne({
      where: { id: flashcardId, userId: user.id },
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
    user: AuthPayload;
    flashcardForm: FlashcardForm;
  }) {
    const result = await this.flashcardRepo.update(
      { id: flashcardId, userId: user.id },
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
      userId: user.id,
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
      userId: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Flashcard not found',
        code: 'FLASHCARD_NOT_FOUND',
      });
    }
    return result;
  }

  async deleteFlashcard({ flashcardId, user }: FlashcardIdAndUser) {
    const result = await this.flashcardRepo.delete({
      id: flashcardId,
      userId: user.id,
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
