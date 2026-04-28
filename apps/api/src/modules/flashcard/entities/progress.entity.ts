import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index, RelationId } from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Session } from '@/modules/session/entities/session.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Session, s => s.progresses, { onDelete: 'CASCADE' })
  session?: Session;

  @RelationId((p: Progress) => p.session)
  sessionId!: number;

  @ManyToOne(() => User, u => u.progresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((p: Progress) => p.user)
  userId!: number;


  @RelationId((p: Progress) => p.flashcard)
  flashcardId!: number;

  @ManyToOne(() => Flashcard, (flashcard) => flashcard.progresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flashcard_id' }) 
  flashcard?: Flashcard;
}
