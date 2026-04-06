import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './entities/credential.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import env from '@/config/env';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategies';
import { UsersService } from '../users/users.service';
import { RefreshStrategy } from './strategies/refresh.strategies';
import { AccessStrategy } from './strategies/access.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersService, RefreshStrategy, AccessStrategy],
  imports: [
    TypeOrmModule.forFeature([Credential, User]),
    TypeOrmModule,
    PassportModule,
    JwtModule.register({})
  ],
  exports: [AuthService]
})
export class AuthModule {} 
