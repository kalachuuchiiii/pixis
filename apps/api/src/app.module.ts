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
import env from './config/env';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,     
      logging: env.NODE_ENV !== 'production',
    }), UsersModule, LoggerModule, AuthModule, DeckModule, FlashcardModule, SessionModule, AttemptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
