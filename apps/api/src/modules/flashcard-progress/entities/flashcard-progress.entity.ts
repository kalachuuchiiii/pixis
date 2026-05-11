import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
  RelationId,
} from 'typeorm';
import { Flashcard } from '../../flashcard/entities/flashcard.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { Deck } from '@/modules/deck/entities/deck.entity';

@Entity('flashcard_progress')
export class FlashcardProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Session, (s) => s.progresses, { onDelete: 'CASCADE' })
  session?: Session;

  @RelationId((p: FlashcardProgress) => p.session)
  sessionId!: number;

  @ManyToOne(() => User, (u) => u.progresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((p: FlashcardProgress) => p.user)
  userId!: number;

  @Column({ name: 'is_answer_correct', nullable: false })
  isAnswerCorrect!: boolean;

  @RelationId((p: FlashcardProgress) => p.flashcard)
  flashcardId!: number;

  @ManyToOne(() => Flashcard, (flashcard) => flashcard.progresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcard_id' })
  flashcard?: Flashcard;

  @ManyToOne(() => Deck, (d) => d.progresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deck_id' })
  deck?: Deck;

  @RelationId((fp: FlashcardProgress) => fp.deck)
  deckId!: number;
}
