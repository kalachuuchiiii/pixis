import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('streak')
export class Streak {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user) => user.streak, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ default: 1, name: 'current_streak' })
  currentStreak!: number;

  @Column({ default: 1, name: 'highest_streak' })
  highestStreak!: number;

  @Column({ default: () => 'now()', name: 'last_action_timestamp' })
  lastActionTimestamp!: Date;
}
