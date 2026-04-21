import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { Progress } from './entities/progress.entity';
import { Deck } from '../deck/entities/deck.entity';
import { DeckModule } from '../deck/deck.module';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService],
  imports: [TypeOrmModule.forFeature([Flashcard, Progress, Deck]), DeckModule],
})
export class FlashcardModule {}
