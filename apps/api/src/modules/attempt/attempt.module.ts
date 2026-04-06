import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptController } from './attempt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './entities/attempt.entity';

@Module({
  controllers: [AttemptController],
  providers: [AttemptService],
  imports: [TypeOrmModule.forFeature([Attempt])]
})
export class AttemptModule {}
