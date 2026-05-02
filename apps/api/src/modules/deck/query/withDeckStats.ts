import { SelectQueryBuilder } from 'typeorm';
import { Deck } from '../entities/deck.entity';

export const withDeckStats = (qb: SelectQueryBuilder<Deck>) => {
  return qb
    .loadRelationCountAndMap('deck.userSavedDeckCount', 'deck.userSavedDecks')
    .loadRelationCountAndMap('deck.flashcardCount', 'deck.flashcards');
};
