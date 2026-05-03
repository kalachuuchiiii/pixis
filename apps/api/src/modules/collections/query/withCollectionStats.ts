import type { SelectQueryBuilder } from 'typeorm';
import type { Collection } from '../entities/collection.entity';

export const withCollectionStats = (qb: SelectQueryBuilder<Collection>) => {
  return qb
    .loadRelationCountAndMap(
      'collection.deckCount',
      'collection.collectionDecks',
    )
    .loadRelationCountAndMap(
      'collection.userSavedCollectionCount',
      'collection.userSavedCollections',
    );
};
