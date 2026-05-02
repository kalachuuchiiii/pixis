import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { User } from '../users/entities/user.entity';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardsController } from './leaderboards.controller';
import { DashboardsModule } from '../dashboards/dashboards.module.js';

@Module({
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  imports: [
    TypeOrmModule.forFeature([FlashcardProgress, User]),
    DashboardsModule,
  ],
})
export class LeaderboardsModule {}
