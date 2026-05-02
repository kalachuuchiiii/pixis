import { isString } from 'class-validator';
import { Credential } from '@/modules/auth/entities/credential.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Point } from './point.entity';
import { Streak } from './streak.entity';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { Collection } from '@/modules/collections/entities/collection.entity';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { FlashcardProgress } from '@/modules/flashcard-progress/entities/flashcard-progress.entity.ts';
import { UserSavedDeck } from '@/modules/user-saved-deck/entities/user-saved-deck.entity';
import { UserSavedCollection } from '@/modules/user-saved-collections/entities/user-saved-collection.entity';
import { Session } from '@/modules/session/entities/session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 26 })
  username!: string;

  @OneToMany(() => Deck, (d) => d.user, { onDelete: 'CASCADE' })
  decks?: Deck[];

  @OneToMany(() => Collection, (c) => c.user, { onDelete: 'CASCADE' })
  collections?: Collection[];

  @OneToMany(() => UserSavedDeck, (sd) => sd.user, { onDelete: 'CASCADE' })
  userSavedDecks?: UserSavedDeck[];

  @OneToMany(() => UserSavedCollection, (usc) => usc.user, {
    onDelete: 'CASCADE',
  })
  userSavedCollections?: UserSavedCollection[];

  @OneToMany(() => CollectionDeck, (cd) => cd.user, { onDelete: 'CASCADE' })
  collectionDecks?: CollectionDeck[];

  @OneToMany(() => Flashcard, (f) => f.user, { onDelete: 'CASCADE' })
  flashcards?: Flashcard[];

  @OneToMany(() => FlashcardProgress, (fp) => fp.user, { onDelete: 'CASCADE' })
  progresses?: FlashcardProgress[];

  @OneToMany(() => Session, (s) => s.user, { onDelete: 'CASCADE' })
  sessions?: Session[];

  @Column({ nullable: true, length: 26, default: '' })
  nickname!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'last_username_update' })
  lastUsernameUpdate!: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'last_nickname_update' })
  lastNicknameUpdate!: Date;

  @Column({ name: 'avatar_public_url', default: null, nullable: true })
  avatarPublicUrl?: string;

  @Column({ nullable: true, name: 'is_private', default: false })
  isPrivate!: boolean;

  @OneToOne(() => Credential, (credential) => credential.user)
  @JoinColumn({ name: 'credential_id' })
  credential!: Credential;

  @OneToOne(() => Point, (point) => point.user)
  @JoinColumn({ name: 'point_id' })
  point!: Point;

  @RelationId((u: User) => u.point)
  pointId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => Streak, (streak) => streak.user)
  @JoinColumn({ name: 'streak_id' })
  streak!: Streak;

  @RelationId((u: User) => u.streak)
  streakId!: number;
}
