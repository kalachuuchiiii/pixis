import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('progress')
export class Progress {

  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ name: 'user_id'})
  userId!: number;

  @Index()
  @Column({ name: 'flashcard_id'})
  flashcardId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Flashcard, (flashcard) => flashcard.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flashcard_id' }) 
  flashcard!: Flashcard;

  @Column({ nullable: true, name: 'next_due_at' })
  nextDueAt!: Date;

  @Column({ default: 1, name: 'interval_days' })
  intervalDays!: number;

  @Column({ type: 'float', default: 2.5, name: 'ease_factor' })
  easeFactor!: number;

  @Column({ default: 0 })
  repetitions!: number;

  @Column({ default: 0 })
  lapses!: number;

  @Column({ nullable: true, name: 'last_reviewed_at' })
  lastReviewedAt!: Date;


  @Column({ name: 'last_rating' })
  lastRating!: number; // 1=Hard, 2=Good, 3=Easy
}
