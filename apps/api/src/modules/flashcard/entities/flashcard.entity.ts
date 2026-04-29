import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, RelationId } from 'typeorm';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { TYPE_ENUM, type FlashcardType } from '@pixis/constants';
import { User } from '@/modules/users/entities/user.entity';
import { FlashcardProgress } from '../../flashcard-progress/entities/flashcardProgress.entity';

@Entity('flashcard')
export class Flashcard {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Deck, d => d.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck?: Deck;

  @RelationId((f: Flashcard) => f.deck)
  deckId!: Number;

  @ManyToOne(() => User, u => u.flashcards)
  @JoinColumn({ name: 'user_id'})
  user!: User;

  @RelationId((flashcard: Flashcard) => flashcard.user)
  userId!: number;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @Column({ nullable: false, enum: TYPE_ENUM })
  type!: FlashcardType;

  @OneToMany(() => FlashcardProgress, (prog) => prog.flashcard, { cascade: true, nullable: true })
  progresses?: FlashcardProgress[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'text', array: true, nullable: true })
  choices!: string[] | null;

  @Column({ name: 'is_answer_case_sensitive', default: false })
  isAnswerCaseSensitive!: boolean;

}