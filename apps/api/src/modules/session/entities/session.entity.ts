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
import { Deck } from '@/modules/deck/entities/deck.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { FlashcardProgress } from '@/modules/flashcard-progress/entities/flashcard-progress.entity';
import {
  EXAM_MODE_ENUM,
  SESSION_STATUS,
  type ExamMode,
  type SessionStatus,
} from '@pixis/constants';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @RelationId((s: Session) => s.user)
  userId!: number;

  @ManyToOne(() => User, (u) => u.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'enum', enum: SESSION_STATUS, default: 'idle' })
  status!: SessionStatus;

  @OneToMany(() => FlashcardProgress, (p) => p.session, { onDelete: 'CASCADE' })
  progresses?: FlashcardProgress[];

  @Column({
    nullable: true,
    type: 'enum',
    enum: EXAM_MODE_ENUM,
    default: 'NORMAL',
  })
  mode!: ExamMode;

  @CreateDateColumn({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;

  @Column({
    name: 'stopped_at',
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  stoppedAt!: Date;

  @Column({ name: 'total_points_gained', default: 0, type: 'float' })
  totalPointsGained!: number;

  @Column({ name: 'accuracy', default: 0, type: 'float' })
  accuracy!: number;

  @ManyToOne(() => Deck, (d) => d.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck?: Deck;

  @RelationId((s: Session) => s.deck)
  deckId!: number;
}
