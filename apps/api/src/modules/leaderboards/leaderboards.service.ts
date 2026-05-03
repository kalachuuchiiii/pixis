import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

import { userBadgeSchema } from '@pixis/schemas';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { POINT_PER_CORRECT } from '@pixis/constants';
import { DashboardsService } from '../dashboards/dashboards.service';
import { withUserStats } from '../users/query/withUserStats';

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
    const mappedResult = result.map((u) => ({
      username: u.user_username,
      nickname: u.user_nickname,
      accuracy: u.user_accuracy,
      decksStudiedCount: u.user_decks_studied_count,
      avatarPublicUrl: u.user_avatar_public_url,
      points: u.user_current_points,
      rank: u.user_rank,
    }));
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
      .leftJoin(
        'user.progresses',
        'fp',
        'fp.isAnswerCorrect = :isAnswerCorrect AND fp.deck.id = :deckId',
        { isAnswerCorrect: true, deckId },
      )
      .select(['user.username', 'user.nickname', 'user.avatarPublicUrl'])
      .addSelect(`COUNT(fp.id) * ${POINT_PER_CORRECT}`, 'user_deck_points')
      .groupBy('user.id')
      .orderBy('user_deck_points', 'DESC');

    const result = await qb.limit(10).getRawMany();
    const normalizedResult = result.map((r) => ({
      username: r.user_username,
      nickname: r.user_nickname,
      avatarPublicUrl: r.user_avatar_public_url,
      deckPoints: r['user_deck_points'],
    }));

    return normalizedResult;
  }
}
