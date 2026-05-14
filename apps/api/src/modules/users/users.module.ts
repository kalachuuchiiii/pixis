import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { Streak } from './entities/streak.entity';
import { AccessStrategy } from '../auth/strategies/access.strategy';
import { DeckModule } from '../deck/deck.module';
import { UploadsModule } from '../uploads/uploads.module';
import { Follow } from './entities/follow.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AccessStrategy],
  imports: [
    TypeOrmModule.forFeature([User, Point, Streak, Follow]),
    DeckModule,
    UploadsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
