import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  type DeepPartial,
  IsNull,
  Equal,
} from 'typeorm';
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
import z, { date } from 'zod';
import { Streak } from '../users/entities/streak.entity.js';

type StreakDetail = {
  increment: boolean;
  reset: boolean;
};

@Injectable()
export class FlashcardProgressService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
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
    let correctCount = 0;
    let mistakeCount = 0;
    let totalPointsGained = 0;

    const values = flashcards.map((f) => {
      const answer = examAnswers.find((a) => a.flashcardId === f.id)
        ?.answer as string;
      const isAnswerCorrect =
        f.type === 'open_ended' && f.isAnswerCaseSensitive
          ? f.answer === answer
          : f.answer.trim().toLowerCase() === answer.trim().toLowerCase();

      if (isAnswerCorrect) {
        correctCount++;
        totalPointsGained += POINT_PER_CORRECT;
      } else {
        mistakeCount++;
        totalPointsGained += POINT_PER_MISTAKE;
      }

      return {
        flashcard: { id: f.id },
        session: { id: sessionId },
        user: { id: user.id },
        deck: { id: f.deckId },
        isAnswerCorrect,
      };
    });
    const accuracy = (correctCount / flashcards.length) * 100;
    const cleanValues = z.array(flashcardProgressValuesSchema).parse(values);
    return {
      data: cleanValues,
      correctCount,
      totalPointsGained,
      accuracy,
    };
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
    const isAbandoned = examAnswers.every((a) => !a.answer.trim());

    const flashcardIds = examAnswers.map(({ flashcardId }) => flashcardId);
    const { flashcards } =
      await this.flashcardService.findAccessibleFlashcardsByIds({
        flashcardIds,
        user,
      });

    const { data, correctCount, totalPointsGained, accuracy } =
      this.createFlashcardsValues({
        flashcards,
        examAnswers,
        sessionId,
        user,
      });

    const values = this.flashcardProgressRepo.create(data);

    return await this.dataSource.manager.transaction(async (m) => {
      await m.save(FlashcardProgress, values);

      const session = await m.update(
        Session,
        { id: sessionId, user: { id: user.id } },
        {
          totalPointsGained,
          accuracy,
          abandonedAt: !isAbandoned ? null : new Date(),
          finishedAt: !isAbandoned ? new Date() : null,
        },
      );

      if (session.affected === 0) {
        throw new NotFoundException({
          message: `Session #${sessionId} is not found`,
          code: 'SESSION_NOT_fOUND',
        });
      }

      if (isAbandoned) {
        const point = await m.increment(
          Point,
          { id: user.point.id },
          'currentPoints',
          totalPointsGained,
        );

        const streak = (await m.findOne(Streak, {
          where: { id: user.streak.id },
        })) as Streak;

        const streakDetails = this.getStreakDetails(streak);
        const { streakData, isTransformed } = this.keepOrTransformStreakObject(
          streak,
          streakDetails,
        );

        if (isTransformed) {
          await m.save(streakData);
        }

        if (point.affected === 0) {
          throw new NotFoundException({
            message: `Point not found`,
            code: 'USER_NOT_FOUND',
          });
        }

        return {
          isStreakIncremented: streakDetails.increment,
          totalFlashcards: flashcards.length,
          totalPointsGained,
          correctCount: 0,
          accuracy,
          isAbandoned,
          isFinished: !isAbandoned,
        };
      }

      return {
        isStreakIncremented: false,
        totalFlashcards: flashcards.length,
        totalPointsGained: 0,
        correctCount,
        isAbandoned,
        accuracy,
        isFinished: !isAbandoned,
      };
    });
  }

  keepOrTransformStreakObject(streak: Streak, streakDetail: StreakDetail) {
    //increment _ reset
    //no increment and no reset

    if (!streakDetail.increment && !streakDetail.reset) {
      return { streakData: streak, isTransformed: false };
    }

    //reset
    if (streakDetail.reset) {
      streak.highestStreak = Math.max(
        streak.currentStreak,
        streak.highestStreak,
      );
      streak.currentStreak = 0;
      streak.lastActionTimestamp = new Date();
      return { streakData: streak, isTransformed: true };
    }
    //increment
    streak.currentStreak += 1;
    streak.highestStreak = Math.max(streak.currentStreak, streak.highestStreak);
    streak.lastActionTimestamp = new Date();
    return { streakData: streak, isTransformed: true };
  }

  getStreakDetails(streak: Streak): StreakDetail {
    const { lastActionTimestamp } = streak;
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (lastActionTimestamp > startOfToday && now < endOfToday) {
      //if the user has answered today, return increment, reset : false (means the streak has alr been incremented)
      return {
        increment: false,
        reset: false,
      };
    }

    if (
      startOfToday.getTime() - lastActionTimestamp.getTime() >
      24 * 60 * 60 * 1000
    ) {
      //if the user was inactive yesterday or more, reset = true
      return {
        increment: false,
        reset: true,
      };
    }

    //if the the user answered yesterday, but not now, return increment;
    return {
      increment: true,
      reset: false,
    };
  }
}
