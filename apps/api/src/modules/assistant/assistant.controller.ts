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
import { AccessGuard } from '../auth/guards/access.guard.js';
import { authUserSchema } from '../auth/schemas/auth.schemas.js';
import type { Request } from 'express';
import {
  ChatMessageSchema,
  ConversationSchema,
  GeneratedSetSchema,
  idSchema,
} from '@pixis/schemas';
import { GENERATE_CHAT_SYSTEM_PROMPT } from './constants/assistant.constant.js';
import z from 'zod';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('/conversations')
  @UseGuards(AccessGuard)
  async getConversations(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const result = await this.assistantService.getConversations({ user });
    const conversations = z.array(ConversationSchema).parse(result);
    return {
      conversations,
    };
  }

  @Delete('/conversations/:conversationId')
  @UseGuards(AccessGuard)
  async deleteConversation(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const conversationId = idSchema.parse(request.params.conversationId);
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
    const user = authUserSchema.parse(request.user);
    const messageId = idSchema.parse(request.params.messageId);
    const set = await this.assistantService.getDeckSetByMessageId({
      messageId,
      user,
    });
    console.log(set);
    const cleanSet = GeneratedSetSchema.parse(set);
    console.log(cleanSet);
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
    const beforeCursor = idSchema.optional().parse(request.query.beforeCursor);
    const afterCursor = idSchema.optional().parse(request.query.afterCursor);

    const user = authUserSchema.parse(request.user);
    const conversationId = idSchema
      .catch(0)
      .parse(request.params.conversationId);
    const result = await this.assistantService.getConversationById({
      conversationId,
      user,
      beforeCursor,
      afterCursor,
      query,
    });
    const cleanMessages = z.array(ChatMessageSchema).parse(result.data);
    return {
      messages: cleanMessages,
      ...result,
    };
  }

  @Post('/generate')
  @UseGuards(AccessGuard)
  async generateSet(@Req() request: Request) {
    const generatedSet = GeneratedSetSchema.parse(request.body.generatedSet);
    const user = authUserSchema.parse(request.user);
    const result = await this.assistantService.createGeneratedSet({
      set: generatedSet,
      user,
    });
    return {
      deckId: result.id,
    };
  }

  @Post('/chat/:conversationId')
  @UseGuards(AccessGuard)
  async chat(@Req() request: Request) {
    const conversationId = idSchema
      .catch(0)
      .parse(request.params.conversationId);
    const user = authUserSchema.parse(request.user);
    const prompt = z.string().parse(request.body.prompt);

    const response = await this.assistantService.chat({
      prompt,
      conversationId: Number(conversationId),
      systemPrompt: GENERATE_CHAT_SYSTEM_PROMPT,
      user,
    });

    return {
      response,
    };
  }
}
