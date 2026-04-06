import bcrypt from 'bcryptjs';
import { User } from '@/modules/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user) => user.credential, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: number;

  @Column()
  password!: string;

  async hashAndSetPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
