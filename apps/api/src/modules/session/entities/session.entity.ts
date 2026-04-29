import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  RelationId,
  OneToMany,
} from 'typeorm';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { FlashcardProgress } from '@/modules/flashcard-progress/entities/flashcardProgress.entity';
import { EXAM_MODE_ENUM, type ExamMode } from '@pixis/constants';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @RelationId((s: Session) => s.user)
  userId!: number;

  @ManyToOne(() => User, (u) => u.sessions)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => FlashcardProgress, (p) => p.session, { onDelete: 'CASCADE' })
  progresses?: FlashcardProgress[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({
    nullable: true,
    type: 'enum',
    enum: EXAM_MODE_ENUM,
    default: 'NORMAL',
  })
  mode!: ExamMode

  @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
  cancelledAt!: Date | null;

  @Column({ nullable: true, type: 'timestamp', name: 'finished_at' })
  finishedAt!: Date | null;

  @ManyToOne(() => Deck, (d) => d.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck?: Deck;

  @RelationId((s: Session) => s.deck)
  deckId!: number;
}
