import type { User } from '@/modules/users/entities/user.entity';
import type { SelectQueryBuilder } from 'typeorm';

export const withLeaderboardStats = (qb: SelectQueryBuilder<User>) => {
  qb.addSelect(
    `COALESCE(SUM(session.totalPointsGained)::float, 0)::float`,
    'user_points',
  )
    .addSelect(
      'COALESCE(AVG(session.accuracy)::float, 0)::float',
      'user_average_accuracy',
    )
    .addSelect(
      `DENSE_RANK() OVER (ORDER BY COALESCE(SUM(session.totalPointsGained)::int, 0) DESC, COALESCE(AVG(session.accuracy)::float, 0) DESC )::int`,
      'user_rank',
    )
    .groupBy('user.id')
    .orderBy('user_rank', 'ASC');
  return qb;
};
