import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { LoggerModule } from './common/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DeckModule } from './modules/deck/deck.module';
import { FlashcardModule } from './modules/flashcard/flashcard.module';
import { SessionModule } from './modules/session/session.module';
import { AttemptModule } from './modules/attempt/attempt.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CollectionDeckModule } from './modules/collection-deck/collection-deck.module';
import { UserSavedDeckModule } from './modules/user-saved-deck/user-saved-deck.module';
import { UserSavedCollectionsModule } from './modules/user-saved-collections/user-saved-collections.module';
import { FlashcardProgressModule } from './modules/flashcard-progress/flashcard-progress.module';
import { LeaderboardsService } from './modules/leaderboards/leaderboards.service';
import { LeaderboardsController } from './modules/leaderboards/leaderboards.controller';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import env from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      logging: env.NODE_ENV !== 'production',
    }),
    UsersModule,
    LoggerModule,
    AuthModule,
    DeckModule,
    FlashcardModule,
    SessionModule,
    AttemptModule,
    CollectionsModule,
    CollectionDeckModule,
    UserSavedDeckModule,
    UserSavedCollectionsModule,
    FlashcardProgressModule,
    LeaderboardsModule,
    DashboardsModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
