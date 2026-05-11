import { Injectable } from '@nestjs/common';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { Deck } from '../deck/entities/deck.entity';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { Session } from '../session/entities/session.entity';
import nestql from 'nestql';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepo: Repository<Deck>,
    @InjectRepository(Flashcard)
    private readonly flashcardRepo: Repository<Flashcard>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async getDashboardData(userId: number) {
    const [deckAccuracies, progressTrends, retentionRate, totalStats] =
      await Promise.all([
        this.getDeckAccuracies(userId),

        this.getProgressTrends(userId),
        this.getRetentionRate(userId),
        this.getTotalStats(userId),
      ]);

    return {
      deckAccuracies,
      retentionRate,
      progressTrends,
      totalSessions: totalStats.sessions,
      totalFlashcardsReviewed: totalStats.flashcards,
    };
  }

  private async getDeckAccuracies(userId: number) {
    const result = await this.flashcardProgressRepo
      .createQueryBuilder('fp')
      .select('fdeck.id', 'deckId')
      .addSelect('fdeck.title', 'fp_title')
      .addSelect('fdeck.id', 'fp_deck_id')
      .addSelect(
        'AVG(CASE WHEN fp.isAnswerCorrect THEN 100 ELSE 0 END)::float',
        'fp_average_accuracy',
      )
      .addSelect('COUNT(fp.id)::int', 'fp_total_attempts')
      .leftJoin('fp.deck', 'fdeck')
      .where('fp.user_id = :userId', { userId })
      .groupBy('fdeck.id')
      .addGroupBy('fdeck.title')
      .orderBy('fp_average_accuracy', 'DESC')
      .getRawMany();

    const mappedResult = result.map((r) =>
      nestql(r, {
        prefix: 'fp',
        pick: ['deck_id', 'title', 'average_accuracy', 'total_attempts'],
      }),
    );
    return mappedResult;
  }

  private async getProgressTrends(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.sessionRepo
      .createQueryBuilder('s')
      .select(`DATE(s.startedAt AT TIME ZONE 'UTC')`, 'date')
      .addSelect('AVG(s.accuracy)', 'averageAccuracy')
      .where('s.user_id = :userId', { userId })
      .andWhere(`s.startedAt >= NOW() - INTERVAL '30 days'`)
      .groupBy(`DATE(s.startedAt AT TIME ZONE 'UTC')`)
      .orderBy(`DATE(s.startedAt AT TIME ZONE 'UTC')`, 'ASC')
      .getRawMany();

    return result;
  }

  private async getRetentionRate(userId: number) {
    const totalCorrect = await this.flashcardProgressRepo.count({
      where: { user: { id: userId }, isAnswerCorrect: true },
    });
    const totalProgresses = await this.flashcardProgressRepo.count({
      where: { user: { id: userId } },
    });
    const retentionRate =
      totalProgresses === 0 ? 0 : (totalCorrect / totalProgresses) * 100;

    return retentionRate;
  }

  private async getTotalStats(userId: number) {
    const [sessions, flashcards] = await Promise.all([
      this.sessionRepo.count({ where: { user: { id: userId } } }),
      this.flashcardProgressRepo.count({ where: { user: { id: userId } } }),
    ]);

    return { sessions, flashcards };
  }
}
