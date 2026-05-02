import { SelectQueryBuilder } from 'typeorm';
import { Deck } from '../entities/deck.entity';

export const withDeckSavedInfo = ({
  qb,
  userId,
}: {
  qb: SelectQueryBuilder<Deck>;
  userId: number;
}) => {
  return qb
    .leftJoinAndMapOne(
      'deck.savedByMe',
      'deck.userSavedDecks',
      'usd',
      'usd.user.id = :userId',
      { userId: userId },
    )
    .select(['deck', 'usd.id']);
};
