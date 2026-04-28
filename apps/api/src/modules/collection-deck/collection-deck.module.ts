import { Module } from '@nestjs/common';
import { CollectionDeckService } from './collection-deck.service';
import { CollectionDeckController } from './collection-deck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionDeck } from './entities/collection-deck.entity';
import { Collection } from '../collections/entities/collection.entity';
import { CollectionsModule } from '../collections/collections.module';
import { DeckModule } from '../deck/deck.module';
import { Deck } from '../deck/entities/deck.entity';

@Module({
  controllers: [CollectionDeckController],
  providers: [CollectionDeckService],
  imports: [TypeOrmModule.forFeature([CollectionDeck, Collection, Deck]), CollectionsModule, DeckModule],
})
export class CollectionDeckModule {}
