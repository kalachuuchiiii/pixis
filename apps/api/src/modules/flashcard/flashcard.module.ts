import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcardProgress.entity';
import { Deck } from '../deck/entities/deck.entity';
import { DeckModule } from '../deck/deck.module';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService],
  imports: [TypeOrmModule.forFeature([Flashcard, FlashcardProgress, Deck]), DeckModule],
  exports: [FlashcardService]
})
export class FlashcardModule {}
