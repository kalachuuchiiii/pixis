import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Deck } from './deck.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Collection } from '@/modules/collections/entities/collection.entity';

@Entity('saved_deck')
export class SavedDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Collection, { onDelete: 'CASCADE' })
  collection?: Collection

  @Column({ name: 'collection_id'})
  collectionId!: number;

  @Column({ name: 'user_id'})
  userId!: number;

  @ManyToOne(() => Deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Column({ name: 'deck_id'})
  deckId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}