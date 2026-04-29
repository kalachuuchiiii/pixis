import { Module } from '@nestjs/common';
import { FlashcardProgressService } from './flashcard-progress.service';
import { FlashcardProgressController } from './flashcard-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardProgress } from './entities/flashcardProgress.entity';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { FlashcardModule } from '../flashcard/flashcard.module';

@Module({
  controllers: [FlashcardProgressController],
  providers: [FlashcardProgressService],
  imports: [TypeOrmModule.forFeature([FlashcardProgress]), FlashcardModule]
})
export class FlashcardProgressModule {}
