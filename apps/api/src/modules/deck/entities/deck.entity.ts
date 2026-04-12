import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { IsString, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength } from 'class-validator';
import  { User } from '@/modules/users/entities/user.entity';
import { DESCRIPTION_MAX, TITLE_MAX, TITLE_MIN } from '@pixis/constants';


@Entity('deck')
export class Deck {

  @DeleteDateColumn()
  deletedAt?: Date;
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id'})
  userId!: number;

  @Column({ type: 'text', nullable: true })
  topic!: string;
  
  @Column({ name: 'participant_count', default: 0 })
  participantCount!: number;

  @Column({ name: 'saved_count', default: 0 })
  savedCount!: number;

  @Column()
  @IsString()
  @MinLength(TITLE_MIN)
  @MaxLength(TITLE_MAX)
  title!: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(DESCRIPTION_MAX)
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ default: 'private' })
  @IsEnum(['private', 'public', 'unlisted'])
  visibility!: 'private' | 'public' | 'unlisted';

  @Column({ default: 0, name: 'popularity_score' })
  popularityScore!: number

  @Column({ nullable: true, name: 'color', default: "#000000" })
  @IsOptional()
  @IsString()
  color!: string; // e.g., '#FF5733'
}