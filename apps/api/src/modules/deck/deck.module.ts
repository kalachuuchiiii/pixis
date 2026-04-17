import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { SavedDeck } from './entities/saved-deck.entity';

@Module({
  controllers: [DeckController],
  providers: [DeckService],
  imports: [TypeOrmModule.forFeature([Deck, SavedDeck])]
})
export class DeckModule {}
