import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Message, (m) => m.conversation, { onDelete: 'CASCADE' })
  messages?: Message[];

  @ManyToOne(() => User, (u) => u.conversations, { onDelete: 'CASCADE' })
  user?: User;

  @RelationId((c: Conversation) => c.user)
  userId!: number;
}
