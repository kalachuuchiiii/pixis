import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature([Session])]
})
export class SessionModule {}
