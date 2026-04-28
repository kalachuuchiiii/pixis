import { Collection } from '@/modules/collections/entities/collection.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('user_saved_collection')
export class UserSavedCollection {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Collection, (c) => c.userSavedCollections, {
    onDelete: 'CASCADE',
  })
  collection?: Collection;

  @RelationId((usc: UserSavedCollection) => usc.collection)
  collectionId!: number;

  @ManyToOne(() => User, (u) => u.userSavedCollections, { onDelete: 'CASCADE' })
  user?: User;

  @RelationId((u: UserSavedCollection) => u.user)
  userId!: number;
}
