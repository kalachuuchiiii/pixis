import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import type { Request } from 'express';
import {
  MessageSchema,
  ConversationSchema,
  GeneratedSetSchema,
  IDSchema,
} from '@pixis/schemas';
import { GENERATE_CHAT_SYSTEM_PROMPT } from './constants/assistant.constant';
import z from 'zod';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { Throttle } from '@nestjs/throttler';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('/conversations')
  @UseGuards(AccessGuard)
  async getConversations(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const result = await this.assistantService.getConversations({ user });
    const conversations = z.array(ConversationSchema).parse(result);
    return {
      conversations,
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Delete('/conversations/:conversationId')
  @UseGuards(AccessGuard)
  async deleteConversation(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const conversationId = IDSchema.parse(request.params.conversationId);
    await this.assistantService.deleteConversationById({
      conversationId,
      user,
    });
    return {
      message: 'Conversation has been deleted!',
    };
  }

  @Get('/messages/:messageId/set')
  @UseGuards(AccessGuard)
  async getDeckSet(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const messageId = IDSchema.parse(request.params.messageId);
    const set = await this.assistantService.getDeckSetByMessageId({
      messageId,
      user,
    });

    const cleanSet = GeneratedSetSchema.parse(set);

    return {
      set: cleanSet,
    };
  }

  @Get('/conversations/:conversationId/messages')
  @UseGuards(AccessGuard)
  async getConversation(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const beforeCursor = IDSchema.optional().parse(request.query.beforeCursor);
    const afterCursor = IDSchema.optional().parse(request.query.afterCursor);

    const user = AuthUserSchema.parse(request.user);
    const conversationId = IDSchema.catch(0).parse(
      request.params.conversationId,
    );
    const result = await this.assistantService.getConversationById({
      conversationId,
      user,
      beforeCursor,
      afterCursor,
      query,
    });

    const cleanMessages = z.array(MessageSchema).parse(result.data);
    return {
      messages: cleanMessages,
      ...result,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/generate')
  @UseGuards(AccessGuard)
  async generateSet(@Req() request: Request) {
    const generatedSet = GeneratedSetSchema.parse(request.body.generatedSet);
    const user = AuthUserSchema.parse(request.user);
    const result = await this.assistantService.createGeneratedSet({
      set: generatedSet,
      user,
    });
    return {
      deckId: result.id,
    };
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('/chat/:conversationId')
  @UseGuards(AccessGuard)
  async chat(@Req() request: Request) {
    const conversationId = IDSchema.catch(0).parse(
      request.params.conversationId,
    );

    const user = AuthUserSchema.parse(request.user);
    const prompt = z.string().parse(request.body.prompt);

    const data = await this.assistantService.chat({
      prompt,
      conversationId: Number(conversationId),
      systemPrompt: GENERATE_CHAT_SYSTEM_PROMPT,
      user,
    });

    const result = {
      response: MessageSchema.parse(data.response),
      conversationId: IDSchema.parse(data.conversationId),
    };

    return {
      result,
    };
  }
}
