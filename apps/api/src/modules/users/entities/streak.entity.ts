import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { type Streak as StreakType } from '@pixis/schemas';

@Entity('streak')
export class Streak {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @OneToOne(() => User, (user) => user.streak, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ default: 0, name: 'current_streak' })
  currentStreak!: number;

  @Column({ default: 0, name: 'highest_streak' })
  highestStreak!: number;

  @Column({ default: 0, name: 'total_streak' })
  totalStreak!: number;

  @Column({ default: () => 'now()', name: 'last_action_timestamp' })
  lastActionTimestamp!: Date;
}
