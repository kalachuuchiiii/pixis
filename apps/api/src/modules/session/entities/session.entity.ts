import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Column()
  deck_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: number;

  @CreateDateColumn({ name: 'started_at' })
  startedAt!: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(['PM', 'SM', 'NM', 'TM'])
  mode!: string;

  @OneToOne(() => Flashcard, { nullable: true })
  @JoinColumn({ name: 'last_flashcard_id' })
  lastFlashcard!: Flashcard;

  @Column({ default: false, name: 'is_cancelled' })
  @IsBoolean()
  isCancelled!: boolean;

  @Column({ nullable: true, name: 'finished_at' })
  finishedAt!: Date;
}