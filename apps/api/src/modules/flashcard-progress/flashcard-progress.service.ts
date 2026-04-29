import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type DeepPartial } from 'typeorm';
import { FlashcardProgress } from './entities/flashcardProgress.entity';
import type { ExamAnswers } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { FlashcardService } from '../flashcard/flashcard.service';

@Injectable()
export class FlashcardProgressService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    private readonly flashcardService: FlashcardService,
  ) {}

  async createProgresses({
    examAnswers,
    user,
    sessionId,
  }: {
    examAnswers: ExamAnswers;
    user: AuthPayload;
    sessionId: number;
  }) {
    const flashcardIds = examAnswers.map(({ flashcardId }) => flashcardId);
    const flashcards =
      await this.flashcardService.findAccessibleFlashcardsByIds({
        flashcardIds,
        user,
        options: {
          select: {
            answer: true,
            id: true,
            type: true,
            isAnswerCaseSensitive: true,
          },
        },
      });

    const flashcardsValues: DeepPartial<FlashcardProgress>[] = flashcards.map(
      (f) => {
        const answer = examAnswers.find((a) => a.flashcardId === f.id)
          ?.answer as string;

        return {
          flashcard: { id: f.id },
          session: { id: sessionId },
          user: { id: user.id },
          isAnswerCorrect:
            f.type === 'open_ended' && f.isAnswerCaseSensitive
              ? f.answer === answer
              : f.answer.trim().toLowerCase() === answer.trim().toLowerCase(),
        };
      },
    );
    const values = this.flashcardProgressRepo.create(flashcardsValues);
    return await this.flashcardProgressRepo.save(values)
  }
}
