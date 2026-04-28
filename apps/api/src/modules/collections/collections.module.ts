import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionDeck } from '../collection-deck/entities/collection-deck.entity';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService],
  imports: [TypeOrmModule.forFeature([Collection, CollectionDeck])],
  exports: [CollectionsService]
})
export class CollectionsModule {}
 