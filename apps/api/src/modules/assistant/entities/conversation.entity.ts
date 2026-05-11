import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Message, (m) => m.conversation, { onDelete: 'CASCADE' })
  messages?: Message[];

  @ManyToOne(() => User, (u) => u.conversations, { onDelete: 'CASCADE' })
  user?: User;

  @RelationId((c: Conversation) => c.user)
  userId!: number;

  @Column({ name: 'title', nullable: true, default: '' })
  title!: string;
}
