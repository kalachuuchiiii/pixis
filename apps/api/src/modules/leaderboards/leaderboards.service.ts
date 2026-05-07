import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

import { userBadgeSchema, type TopGlobalUser } from '@pixis/schemas';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { POINT_PER_CORRECT } from '@pixis/constants';
import { DashboardsService } from '../dashboards/dashboards.service';
import { withUserStats } from '../users/query/withUserStats';
import nestql from 'nestql';

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getLeaderboards() {
    /**{
    rank: 6,
    username: "mike_t",
    nickname: "",
    avatarPublicUrl: "ad2342/32.png"
    points: 8740,
    decksStudiedCount: 26,
    accuracy: 82
  }, */

    const qb = withUserStats(this.userRepo.createQueryBuilder('user')).limit(
      10,
    );
    const result = await qb.getRawMany();
    const mappedResult = result.map((r) =>
      nestql<TopGlobalUser>(r, {
        prefix: 'user',
        casing: 'camel',
        pick: [
          'username',
          'nickname',
          'accuracy',
          'decks_studied_count',
          'avatar_public_url',
          'current_points',
          'rank',
        ],
      }),
    );
    return mappedResult;
  }

  async getDeckLeaderboards({
    deckId,
    user,
  }: {
    deckId: number;
    user: AuthUser;
  }) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.sessions', 'session', 'session.deck.id = :deckId', {
        deckId,
      })
      .select(['user.username', 'user.nickname', 'user.avatarPublicUrl'])
      .addSelect(
        `COALESCE(SUM(session.totalPointsGained)::int, 0)`,
        'user_deck_points',
      )
      .addSelect('COALESCE(AVG(session.accuracy)::int, 0)', 'user_accuracy')
      .groupBy('user.id')
      .orderBy('user_deck_points', 'DESC')
      .addOrderBy('user_accuracy', 'DESC');

    const result = await qb.limit(10).getRawMany();
    const mappedResult = result.map((r) =>
      nestql(r, {
        prefix: 'user',
        pick: [
          'username',
          'nickname',
          'avatar_public_url',
          'deck_points',
          'accuracy',
        ],
      }),
    );

    return mappedResult;
  }
}
