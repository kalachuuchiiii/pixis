import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, DeleteDateColumn, Index, OneToMany, OneToOne } from 'typeorm';
import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { TYPE_ENUM } from '@pixis/constants';
import { User } from '@/modules/users/entities/user.entity';
import { flashcardFormSchema, flashcardRefIds } from '@pixis/schemas';
import { Progress } from './progress.entity';

@Entity('flashcard')
export class Flashcard {

  @DeleteDateColumn()
  deletedAt?: Date;

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Index()
  @Column({ name: 'deck_id'})
  deckId!: number;

  @OneToOne(( ) => Deck)
  @JoinColumn({ name: 'deck_preview'})
  deckPreview?: Deck

  @Index()
  @Column({ name: 'user_id'})
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id'})
  user!: User;

  @Column()
  @IsString() 
  @MinLength(1)
  question!: string;

  @Column()
  @IsString()
  @MinLength(1)
  answer!: string;

  @Column({ nullable: false })
  @IsOptional()
  @IsEnum(TYPE_ENUM)
  type!: string;

  @OneToMany(() => Progress, (prog) => prog.flashcard, { cascade: true, nullable: true })
  progress?: Progress[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'text', array: true, nullable: true })
  choices!: string[] | null;

  @Column({ name: 'is_answer_case_sensitive', default: false })
  isAnswerCaseSensitive!: boolean;

  @BeforeInsert()
  validate(){
      flashcardFormSchema.and(flashcardRefIds).parse(this);
  }
}