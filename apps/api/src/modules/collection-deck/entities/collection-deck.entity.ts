import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { Collection } from '@/modules/collections/entities/collection.entity';
import { Deck } from '@/modules/deck/entities/deck.entity';

@Entity('collection_deck')
export class CollectionDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.collectionDecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((cd: CollectionDeck) => cd.user)
  userId!: number;

  @ManyToOne(() => Collection, (cd) => cd.collectionDecks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection?: Collection;

  @RelationId((cd: CollectionDeck) => cd.collection)
  collectionId!: number;

  @ManyToOne(() => Deck, (deck) => deck.collectionDecks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @RelationId((cd: CollectionDeck) => cd.deck)
  deckId!: number;
}
