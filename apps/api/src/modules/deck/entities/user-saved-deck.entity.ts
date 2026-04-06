import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Deck } from './deck.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('user_saved_deck')
export class UserSavedDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: number;

  @ManyToOne(() => Deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck!: Deck;

  @Column()
  deck_id!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}