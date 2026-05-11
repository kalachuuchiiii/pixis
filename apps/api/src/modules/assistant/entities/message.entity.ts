import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '@/modules/users/entities/user.entity';
import type { GeneratedSet } from '@pixis/schemas';

@Entity('message')
export class Message {
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.messages, { onDelete: 'CASCADE' })
  user?: User;

  @RelationId((m: Message) => m.user)
  userId!: number;

  @Column({ type: 'enum', enum: ['user', 'assistant'] })
  role!: 'user' | 'assistant';

  @Column({ default: '' })
  content!: string;

  @Column({ enum: ['text', 'generate'] })
  type!: 'text' | 'generate';

  @Column({ nullable: true, type: 'jsonb' })
  set?: GeneratedSet | null | undefined;

  @RelationId((m: Message) => m.conversation)
  conversationId!: number;

  @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE' })
  conversation?: Conversation;
}
