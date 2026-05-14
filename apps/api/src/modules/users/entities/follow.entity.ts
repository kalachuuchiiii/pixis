import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Unique(['follower', 'following'])
@Entity('follow')
export class Follow {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.following, { onDelete: 'CASCADE' })
  follower!: User;

  @ManyToOne(() => User, (u) => u.followers, { onDelete: 'CASCADE' })
  following!: User;

  @CreateDateColumn({ name: 'followed_at' })
  followedAt!: Date;
}
