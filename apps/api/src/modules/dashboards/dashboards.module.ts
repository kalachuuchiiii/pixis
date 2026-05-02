import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { User } from '../users/entities/user.entity';

@Module({
  providers: [DashboardsService],
  imports: [TypeOrmModule.forFeature([FlashcardProgress, User])],
  exports: [DashboardsService],
})
export class DashboardsModule {}
