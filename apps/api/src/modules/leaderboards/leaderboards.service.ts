import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

import {
  userBadgeSchema,
  type TopGlobalUser,
  type TopUser,
} from '@pixis/schemas';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { POINT_PER_CORRECT } from '@pixis/constants';
import { DashboardsService } from '../dashboards/dashboards.service';
import { withUserStats } from '../users/query/withUserStats';
import nestql from 'nestql';
import { withLeaderboardStats } from './query/withLeaderboardStats';

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
    averageAccuracy: 82.00
  }, */

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.sessions', 'session');
    const result = await withLeaderboardStats(qb).limit(10).getRawMany();
    const mappedResult = result.map((r) =>
      nestql<TopUser>(r, {
        prefix: 'user',
        casing: 'camel',
        pick: [
          'username',
          'nickname',
          'average_accuracy',
          'avatar_public_url',
          'points',
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
      });

    const result = await withLeaderboardStats(qb).limit(10).getRawMany();
    const mappedResult = result.map((r) =>
      nestql<TopUser>(r, {
        prefix: 'user',
        pick: [
          'username',
          'nickname',
          'avatar_public_url',
          'points',
          'average_accuracy',
          'rank',
        ],
      }),
    );
    console.log(mappedResult);

    return mappedResult;
  }
}
