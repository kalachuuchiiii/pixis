import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from '@/modules/users/entities/user.entity';
import { Deck } from '@/modules/deck/entities/deck.entity';
import { CollectionDeck } from '@/modules/collection-deck/entities/collection-deck.entity';
import { Point } from '@/modules/users/entities/point.entity';
import { Follow } from '@/modules/users/entities/follow.entity';
import { Collection } from '@/modules/collections/entities/collection.entity';
import { Flashcard } from '@/modules/flashcard/entities/flashcard.entity';
import { FlashcardProgress } from '@/modules/flashcard-progress/entities/flashcard-progress.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { UserSavedCollection } from '@/modules/user-saved-collections/entities/user-saved-collection.entity';
import { UserSavedDeck } from '@/modules/user-saved-deck/entities/user-saved-deck.entity';
import { Conversation } from '@/modules/assistant/entities/conversation.entity';
import { Message } from '@/modules/assistant/entities/message.entity';
import { Streak } from '@/modules/users/entities/streak.entity';
import { Credential } from '@/modules/auth/entities/credential.entity';

const isProd = process.env.NODE_ENV === 'production';

//save
const AppDataSource = new DataSource({
  type: 'postgres',
  schema: 'public',
  url: process.env.DATABASE_URL!,
  port: Number(process.env.PORT),
  migrations: [isProd ? 'dist/src/migrations/*.js' : 'src/migrations/*.ts'],
  entities: [Message, Streak, Credential, User, Deck, CollectionDeck, Point, Follow, Collection, Flashcard, FlashcardProgress, Session, UserSavedCollection, UserSavedDeck, Conversation],
  synchronize: false,
  logging: !isProd,
}); //hi

export default AppDataSource;
