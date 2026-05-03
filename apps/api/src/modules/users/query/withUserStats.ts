import { SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';

export const withUserStats = (qb: SelectQueryBuilder<User>) => {
  return qb
    .leftJoin('user.sessions', 'session')
    .leftJoin('user.point', 'point')
    .leftJoin('user.progresses', 'progress')
    .addSelect('RANK() OVER (ORDER BY point.currentPoints DESC)', 'user_rank')
    .addSelect(
      'COUNT(DISTINCT session.deck.id)::int',
      'user_decks_studied_count',
    )
    .addSelect('point.currentPoints', 'user_current_points')
    .addSelect(
      '(COUNT(DISTINCT progress.id) FILTER (WHERE progress.isAnswerCorrect = TRUE)::float / NULLIF(COUNT(DISTINCT progress.id)::int, 0)) * 100',
      'user_accuracy',
    )
    .orderBy('point.currentPoints', 'DESC')
    .groupBy('user.id')
    .addGroupBy('point.id');
};
