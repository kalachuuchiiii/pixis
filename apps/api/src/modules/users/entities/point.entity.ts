import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('point')
export class Point {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id'})
  userId!: number;

  @OneToOne(() => User, (user) => user.point, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ default: 0, name: 'current_points' })
  currentPoints!: number;

  @Column({ default: 0, name: 'highest_points' })
  highestPoints!: number;

  @Column({ default: 0, name: 'total_points' })
  totalPoints!: number;
}