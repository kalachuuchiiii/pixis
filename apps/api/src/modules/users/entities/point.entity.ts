import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BeforeUpdate,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

//point => point (all time). deck points are calculated based on progress (or attempts)

@Entity('point')
export class Point {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @OneToOne(() => User, (user) => user.point, { onDelete: 'CASCADE' })
  user!: User;

  @RelationId((p: Point) => p.user)
  userId!: number;

  @Column({ default: 0, name: 'current_points' })
  currentPoints!: number;

  @Column({ default: 0, name: 'highest_points' })
  highestPoints!: number;

  @BeforeUpdate()
  async setHighestPoints() {
    this.highestPoints = Math.max(
      this.currentPoints ?? 0,
      this.highestPoints ?? 0,
    );
  }
}
