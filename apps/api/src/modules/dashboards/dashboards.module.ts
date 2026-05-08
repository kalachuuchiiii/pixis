import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { User } from '../users/entities/user.entity';
import { Deck } from '../deck/entities/deck.entity';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { Session } from '../session/entities/session.entity';
import { DashboardsController } from './dashboards.controller';

@Module({
  providers: [DashboardsService],
  imports: [
    TypeOrmModule.forFeature([
      FlashcardProgress,
      User,
      Deck,
      Flashcard,
      Session,
    ]),
  ],
  exports: [DashboardsService],
  controllers: [DashboardsController],
})
export class DashboardsModule {}
