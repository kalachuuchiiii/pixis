import { Module } from '@nestjs/common';
import { FlashcardProgressService } from './flashcard-progress.service';
import { FlashcardProgressController } from './flashcard-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardProgress } from './entities/flashcard-progress.entity';
import { FlashcardModule } from '../flashcard/flashcard.module';
import { Session } from '../session/entities/session.entity';

@Module({
  controllers: [FlashcardProgressController],
  providers: [FlashcardProgressService],
  imports: [
    TypeOrmModule.forFeature([FlashcardProgress, Session]),
    FlashcardModule,
  ],
})
export class FlashcardProgressModule {}
