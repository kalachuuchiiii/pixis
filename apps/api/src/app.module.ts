import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DeckModule } from './modules/deck/deck.module';
import { FlashcardModule } from './modules/flashcard/flashcard.module';
import { SessionModule } from './modules/session/session.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { CollectionDeckModule } from './modules/collection-deck/collection-deck.module';
import { UserSavedDeckModule } from './modules/user-saved-deck/user-saved-deck.module';
import { UserSavedCollectionsModule } from './modules/user-saved-collections/user-saved-collections.module';
import { FlashcardProgressModule } from './modules/flashcard-progress/flashcard-progress.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import env from './config/env';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

const isProd = env.NODE_ENV === 'production';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: isProd ? env.PROD_DB_HOST : env.DB_HOST,
      port: isProd ? env.PROD_DB_PORT : env.DB_PORT,
      username: isProd ? env.PROD_DB_USER : env.DB_USER,
      password: isProd ? env.PROD_DB_PASS : env.DB_PASS,
      database: isProd ? env.PROD_DB_NAME : env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: !isProd,
      ssl: isProd ? { rejectUnauthorized: true } : false,
    }),
    UsersModule,
    AuthModule,
    DeckModule,
    FlashcardModule,
    SessionModule,
    CollectionsModule,
    CollectionDeckModule,
    UserSavedDeckModule,
    UserSavedCollectionsModule,
    FlashcardProgressModule,
    LeaderboardsModule,
    DashboardsModule,
    AssistantModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
