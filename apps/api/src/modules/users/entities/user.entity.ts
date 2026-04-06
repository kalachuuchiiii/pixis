import { isString } from 'class-validator';
import { Credential } from '@/modules/auth/entities/credential.entity';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from './point.entity';
import { Streak } from './streak.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 26 })
  username!: string;

  @Column({ nullable: true, length: 26, default: '' })
  nickname!: string;

  get displayName(): string {
    return this.nickname ?? this.username;
  }

  @CreateDateColumn({ type: 'timestamptz' })
  lastUsernameUpdate!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  lastNicknameUpdate!: Date;

  @Column({  name: 'avatar_public_url', default: null, nullable: true })
  avatarPublicUrl?: string;

  @Column({ nullable: true, name: 'is_private', default: false })
  isPrivate!: boolean;

  @OneToOne(() => Credential, (credential) => credential.user)
  credential!: Credential; 

  @OneToOne(() => Point, (point) => point.user)
  point!: Point;

  @OneToOne(() => Streak, (streak) => streak.user)
  streak!: Streak;
}
