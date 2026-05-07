import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { UserSavedDeck } from '../user-saved-deck/entities/user-saved-deck.entity';
import { SessionModule } from '../session/session.module';
import { Flashcard } from '../flashcard/entities/flashcard.entity.js';

@Module({
  controllers: [DeckController],
  providers: [DeckService],
  imports: [
    TypeOrmModule.forFeature([Deck, UserSavedDeck, Flashcard]),
    SessionModule,
  ],
  exports: [DeckService],
})
export class DeckModule {}
