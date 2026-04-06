import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { UserFlashcardProgress } from './entities/user-flashcard-progress.entity';
import { AccessStrategy } from '../auth/strategies/access.strategy';
import { Deck } from '../deck/entities/deck.entity';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService, AccessStrategy],
  imports: [TypeOrmModule.forFeature([Flashcard, UserFlashcardProgress, Deck])]
})
export class FlashcardModule {}
