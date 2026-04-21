import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  RelationId,
} from 'typeorm';
import { Deck } from './deck.entity';
import { User } from '@/modules/users/entities/user.entity';
@Entity('user_saved_deck')
export class UserSavedDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((d: UserSavedDeck) => d.user)
  userId!: number;

  @ManyToOne(() => Deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id' })
  deck?: Deck;

  @RelationId((d: UserSavedDeck) => d.deck)
  deckId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
