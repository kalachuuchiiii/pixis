import { Injectable } from '@nestjs/common';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../session/entities/session.entity';
import { nestql } from '../../common/utils/nestql';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) { }

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
    const dayExpr = `DATE(s.started_at AT TIME ZONE 'UTC')`;

    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .select(dayExpr, 'date')
      .addSelect(`AVG(NULLIF(s.accuracy, 'NaN'))`, 'averageAccuracy')
      .where('s.user_id = :userId', { userId })
      .andWhere(`s.started_at >= NOW() - INTERVAL '30 days'`)
      .groupBy(dayExpr)
      .orderBy(dayExpr, 'ASC')

    const result = await qb.getRawMany();
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
