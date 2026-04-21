import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn, OneToOne, OneToMany, RelationId } from 'typeorm';
import { IsString, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength } from 'class-validator';
import  { User } from '@/modules/users/entities/user.entity';
import { DESCRIPTION_MAX, TITLE_MAX, TITLE_MIN, VISIBILITY_ENUM, type Visibility } from '@pixis/constants';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';


@Entity('deck')
export class Deck {

  @DeleteDateColumn({ name: 'deleted_at'})
  deletedAt?: Date;
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((d: Deck) => d.user)
  userId!: number;

  @OneToMany(() => CollectionDeck, cd => cd.deck, { onDelete: 'CASCADE' })
  collectionDecks?: CollectionDeck[]

  @OneToMany(() => Flashcard, f => f.deck, { onDelete: 'CASCADE'})
  flashcards?: Flashcard[]

  @Column({ name: 'flashcard_count', nullable: false, default: 0 })
  flashcardCount!: number;

  @Column({ type: 'text', nullable: true })
  topic!: string;
  
  @Column({ name: 'participant_count', default: 0 })
  participantCount!: number;

  @Column({ name: 'saved_count', default: 0 })
  savedCount!: number;

  @Column()
  title!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ default: 'private', enum: VISIBILITY_ENUM })
  visibility!: Visibility;

  @Column({ default: 0, name: 'popularity_score' })
  popularityScore!: number

  @Column({ nullable: true, name: 'color', default: "#000000" })
  color!: string; // e.g., '#FF5733'
}