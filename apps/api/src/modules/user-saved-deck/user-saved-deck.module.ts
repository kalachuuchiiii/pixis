import { Module } from '@nestjs/common';
import { UserSavedDeckService } from './user-saved-deck.service';
import { UserSavedDeckController } from './user-saved-deck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSavedDeck } from './entities/user-saved-deck.entity';
import { DeckModule } from '../deck/deck.module';
import { Deck } from '../deck/entities/deck.entity';

@Module({
  controllers: [UserSavedDeckController],
  providers: [UserSavedDeckService, ],
  imports: [TypeOrmModule.forFeature([UserSavedDeck, Deck]), DeckModule]
})
export class UserSavedDeckModule {}
