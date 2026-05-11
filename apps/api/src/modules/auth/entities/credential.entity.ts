import bcrypt from 'bcryptjs';
import { User } from '@/modules/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user) => user.credential, { onDelete: 'CASCADE' })
  user?: User;

  @RelationId((c: Credential) => c.user)
  userId!: number;

  @Column()
  password!: string;

  @BeforeInsert()
  async function() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  }

  async hashPassword(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
