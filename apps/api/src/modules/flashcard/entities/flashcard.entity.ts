import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { TYPE_ENUM } from '@pixis/constants';
import { User } from '@/modules/users/entities/user.entity';

@Entity('flashcard')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Column({ name: 'deck_id'})
  deckId!: number;

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

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(TYPE_ENUM)
  type!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'text', array: true, nullable: true })
  choices!: string[] | null;
}