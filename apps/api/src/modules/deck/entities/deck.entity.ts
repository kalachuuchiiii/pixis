import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  TITLE_MIN,
  VISIBILITY_ENUM,
  type Visibility,
} from '@pixis/constants';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';
import { UserSavedDeck } from '@/modules/user-saved-deck/entities/user-saved-deck.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { FlashcardProgress } from '@/modules/flashcard-progress/entities/flashcard-progress.entity';

@Entity('deck')
export class Deck {
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => FlashcardProgress, (fp) => fp.deck, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  progresses?: FlashcardProgress[];

  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @ManyToOne(() => User, (u) => u.decks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((d: Deck) => d.user)
  userId!: number;

  @OneToMany(() => Session, (s) => s.deck, { onDelete: 'CASCADE' })
  sessions?: Session[];

  @OneToMany(() => CollectionDeck, (cd) => cd.deck, { onDelete: 'CASCADE' })
  collectionDecks?: CollectionDeck[];

  @OneToMany(() => Flashcard, (f) => f.deck, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  flashcards?: Flashcard[];

  @RelationId((d: Deck) => d.flashcards)
  flashcardIds!: number[];

  @Column({ name: 'flashcard_count', nullable: false, default: 0 })
  flashcardCount!: number;

  @Column({ type: 'text', nullable: true })
  topic!: string;

  @OneToMany(() => UserSavedDeck, (usd) => usd.deck, { onDelete: 'CASCADE' })
  userSavedDecks?: UserSavedDeck[];

  @Column({ name: 'user_saved_deck_count', default: 0 })
  userSavedDeckCount!: number;

  @Column()
  title!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ default: 'private', enum: VISIBILITY_ENUM })
  visibility!: Visibility;

  @Column({ default: 0, name: 'popularity_score' })
  popularityScore!: number;

  @Column({ nullable: true, name: 'color', default: '#000000' })
  color!: string; // e.g., '#FF5733'
}
