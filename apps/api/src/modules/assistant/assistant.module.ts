import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService],
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, User]),
    UploadsModule,
  ],
})
export class AssistantModule {}
