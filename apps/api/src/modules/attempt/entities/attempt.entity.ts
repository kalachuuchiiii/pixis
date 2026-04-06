import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';

@Entity('attempt')
export class Attempt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, name: 'time_taken_seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeTakenSeconds!: number;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Column({ name: 'deck_id'})
  deckId!: number;

  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session!: Session;

  @Column({ name: 'session_id' })
  sessionId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id'})
  userId!: number;

  @ManyToOne(() => Flashcard)
  @JoinColumn({ name: 'flashcard_id' })
  flashcard!: Flashcard;

  @Column({ name: 'flashcard_id'})
  flashcardId!: number;

  @Column({ nullable: true })
  answer!: string;

  @Column({ nullable: true, name: 'is_correct' })
  @IsOptional()
  @IsBoolean()
  isCorrect!: boolean;
}