import { Deck } from '@/modules/deck/entities/deck.entity';
import { SavedDeck } from '@/modules/deck/entities/saved-deck.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, default: '' })
  name!: string;

  @Column({ enum: ['private', 'public'], default: 'private' })
  visibility!: 'private' | 'public';

  @Index()
  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at'})
  deletedAt?: Date;

  @OneToMany(() => SavedDeck, (deck) => deck.collectionId, { onDelete: 'CASCADE'})
  decks?: Deck[];

  @Column({ nullable: true, name: 'color', default: "#000000" })
  color!: string; // e.g., '#FF5733'
}
