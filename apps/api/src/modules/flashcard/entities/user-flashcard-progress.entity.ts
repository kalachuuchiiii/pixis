import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('user_flashcard_progress')
export class UserFlashcardProgress {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  flashcard_id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Flashcard, { onDelete: 'CASCADE' })
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

  @Column({ nullable: true, name: 'last_rating' })
  lastRating!: number; // 1=Again, 2=Hard, 3=Good, 4=Easy
}
