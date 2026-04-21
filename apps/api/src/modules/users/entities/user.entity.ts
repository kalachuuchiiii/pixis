import { isString } from 'class-validator';
import { Credential } from '@/modules/auth/entities/credential.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from './point.entity';
import { Streak } from './streak.entity';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { Collection } from '@/modules/collections/entities/collection.entity';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { Progress } from '@/modules/flashcard/entities/progress.entity';
import { UserSavedDeck } from '@/modules/deck/entities/user-saved-deck.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 26 })
  username!: string;

  @OneToMany(() => Deck, d => d.user, { onDelete: 'CASCADE' })
  decks?: Deck[];

  @OneToMany(() => Collection, c => c.user, { onDelete: 'CASCADE' })
  collections?: Collection[];

  @OneToMany(() => UserSavedDeck, sd => sd.user, { onDelete: 'CASCADE' })
  userSavedDecks?: UserSavedDeck[];

  @OneToMany(() => CollectionDeck, (cd) => cd.user, { onDelete: 'CASCADE' })
  collectionDecks?: CollectionDeck[];

  @OneToMany(() => Flashcard, f => f.user, { onDelete: 'CASCADE' })
  flashcards?: Flashcard[];

  @OneToMany(() => Progress, p => p.user, {onDelete: 'CASCADE' })
  progresses?: Progress[]

  @Column({ nullable: true, length: 26, default: '' })
  nickname!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  lastUsernameUpdate!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  lastNicknameUpdate!: Date;

  @Column({  name: 'avatar_public_url', default: null, nullable: true })
  avatarPublicUrl?: string;

  @Column({ nullable: true, name: 'is_private', default: false })
  isPrivate!: boolean;

  @OneToOne(() => Credential, (credential) => credential.user)
  @JoinColumn({ name: 'credential_id' })
  credential!: Credential; 

  @OneToOne(() => Point, (point) => point.user)
  @JoinColumn({ name: 'point_id'})
  point!: Point;

  @OneToOne(() => Streak, (streak) => streak.user)
  @JoinColumn({ name: 'streak_id' })
  streak!: Streak;
}
