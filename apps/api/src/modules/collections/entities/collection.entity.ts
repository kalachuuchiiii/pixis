
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { VISIBILITY_ENUM, type Visibility } from '@pixis/constants';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, default: '' })
  name!: string;

  @Column({ enum: VISIBILITY_ENUM, default: 'private' })
  visibility!: Visibility;

  @ManyToOne(() => User, u => u.collections)
  @JoinColumn({ name: 'user_id' })
  user?: User; 

  @RelationId((c: Collection) => c.user)
  userId!: number;

  @OneToMany(() => CollectionDeck, cd => cd.collection)
  collectionDecks?: CollectionDeck[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at'})
  deletedAt?: Date;

  @Column({ name: 'deck_count', default: 0 })
  deckCount?: number

  @Column({ nullable: true, name: 'color', default: "#000000" })
  color!: string; // e.g., '#FF5733'
}
