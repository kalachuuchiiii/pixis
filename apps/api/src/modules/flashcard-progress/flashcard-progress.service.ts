import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, type DeepPartial, IsNull } from 'typeorm';
import { FlashcardProgress } from './entities/flashcard-progress.entity.ts';
import { userBadgeSchema, type ExamAnswers } from '@pixis/schemas';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { FlashcardService } from '../flashcard/flashcard.service';
import { Session } from '../session/entities/session.entity';
import { POINT_PER_CORRECT, POINT_PER_MISTAKE } from '@pixis/constants';
import { User } from '../users/entities/user.entity';
import { Point } from '../users/entities/point.entity';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { flashcardProgressValuesSchema } from './schemas/flashcard-progress.schemas.js';
import z from 'zod';

@Injectable()
export class FlashcardProgressService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    private readonly flashcardService: FlashcardService,
    private readonly dataSource: DataSource,
  ) {}

  createFlashcardsValues({
    flashcards,
    examAnswers,
    sessionId,
    user,
  }: {
    flashcards: Flashcard[];
    examAnswers: ExamAnswers;
    sessionId: number;
    user: AuthUser;
  }) {
    const values = flashcards.map((f) => {
      const answer = examAnswers.find((a) => a.flashcardId === f.id)
        ?.answer as string;

      return {
        flashcard: { id: f.id },
        session: { id: sessionId },
        user: { id: user.id },
        deck: { id: f.deckId },
        isAnswerCorrect:
          f.type === 'open_ended' && f.isAnswerCaseSensitive
            ? f.answer === answer
            : f.answer.trim().toLowerCase() === answer.trim().toLowerCase(),
      };
    });
    const cleanValues = z.array(flashcardProgressValuesSchema).parse(values);
    return cleanValues as DeepPartial<FlashcardProgress>[];
  }

  async createProgresses({
    examAnswers,
    user,
    sessionId,
  }: {
    examAnswers: ExamAnswers;
    user: AuthUser;
    sessionId: number;
  }) {
    const flashcardIds = examAnswers.map(({ flashcardId }) => flashcardId);
    const { flashcards, isFullMatch } =
      await this.flashcardService.findAccessibleFlashcardsByIds({
        flashcardIds,
        user,
      });

    const flashcardsValues = this.createFlashcardsValues({
      flashcards,
      examAnswers,
      sessionId,
      user,
    });
    const values = this.flashcardProgressRepo.create(flashcardsValues);
    return await this.dataSource.manager.transaction(async (m) => {
      const progresses = await m.save(FlashcardProgress, values);
      const totalPoints = progresses.reduce((acc, prev) => {
        if (prev.isAnswerCorrect) {
          return acc + POINT_PER_CORRECT;
        }
        return acc + POINT_PER_MISTAKE;
      }, 0);

      const session = await m.update(
        Session,
        { id: sessionId, user: { id: user.id } },
        {
          cancelledAt: isFullMatch ? null : new Date(),
          finishedAt: isFullMatch ? new Date() : null,
        },
      );

      const point = await m.increment(
        Point,
        { id: user.point.id },
        'currentPoints',
        totalPoints,
      );

      if (point.affected === 0) {
        throw new NotFoundException({
          message: `User not found`,
          code: 'USER_NOT_FOUND',
        });
      }

      if (session.affected === 0) {
        throw new NotFoundException({
          message: `Session #${sessionId} is not found`,
          code: 'SESSION_NOT_fOUND',
        });
      }

      return {
        session,
        point,
        progresses,
      };
    });
  }
}
