import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../auth/schemas/auth.schemas.js';
import env from '../../config/env.js';
import { GENERATE_CHAT_SYSTEM_PROMPT } from './constants/assistant.constant.js';
import { Deck } from '../deck/entities/deck.entity.js';
import { DataSource, type Repository } from 'typeorm';
import {
  AssistantResponseSchema,
  BaseMessageSchema,
  ChatMessageSchema,
  type ChatMessage,
  type GeneratedSet,
} from '@pixis/schemas';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import z from 'zod';
import { type PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class AssistantService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getDeckSetByMessageId({
    messageId,
    user,
  }: {
    messageId: number;
    user: AuthUser;
  }) {
    const message = await this.messageRepo.findOne({
      where: {
        id: messageId,
        user: { id: user.id },
        type: 'generate',
        role: 'assistant',
      },
      select: { set: true, id: true },
    });
    if (!message) {
      throw new NotFoundException({
        message: 'Deck set not found',
        code: 'DECK_SET_NOT_FOUND',
      });
    }
    return message.set;
  }

  async getConversationById({
    query,
    user,
    beforeCursor,
    afterCursor,
    conversationId,
  }: {
    user: AuthUser;
    beforeCursor?: number;
    afterCursor?: number;
    conversationId: number;
    query: PaginateQuery;
  }) {
    const limit = Number(query.limit ?? 6) || 6;
    const fetchLimit = limit + 1;

    const qb = this.messageRepo
      .createQueryBuilder('message')
      .where(
        'message.conversation.id = :conversationId AND message.user.id = :userId',
        { conversationId, userId: user.id },
      )
      .select([
        'message.id',
        'message.role',
        'message.content',
        'message.type',
      ]);

    if (beforeCursor) {
      qb.andWhere('message.id < :cursor', { cursor: beforeCursor })
        .orderBy('message.id', 'DESC')
        .take(fetchLimit);
    } else if (afterCursor) {
      qb.andWhere('message.id > :cursor', { cursor: afterCursor })
        .orderBy('message.id', 'ASC')
        .take(fetchLimit);
    } else {
      qb.orderBy('message.id', 'DESC').take(fetchLimit);
    }

    const rawMessages = await qb.getMany();
    const messages = rawMessages.slice(0, limit);

    const sortedMessages = afterCursor ? messages : messages.reverse();

    const beforeCursorId = sortedMessages[0]?.id ?? null;
    const afterCursorId = sortedMessages[sortedMessages.length - 1]?.id ?? null;

    return {
      data: sortedMessages,
      beforeCursor: beforeCursorId,
      afterCursor: afterCursorId,
      totalItems: null,
      totalPages: null,
    };
  }

  async deleteConversationById({
    user,
    conversationId,
  }: {
    user: AuthUser;
    conversationId: number;
  }) {
    const result = await this.conversationRepo.delete({
      id: conversationId,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException({
        message: `Conversation not found`,
        code: 'CONVERSATION_NOT_FOUND',
      });
    }
    return result;
  }

  async createConversation({ user }: { user: AuthUser }) {
    const conversationCount = await this.conversationRepo.count({
      where: { user: { id: user.id } },
    });
    if (conversationCount >= 10) {
      throw new BadRequestException({
        message:
          'You have reached the maximum of 10 conversations. Please delete an existing conversation to create a new one.',
        code: 'MAX_CONVERSATIONS_REACHED',
      });
    }
    const newConversation = this.conversationRepo.create({
      user: { id: user.id },
    });
    return await this.conversationRepo.save(newConversation);
  }

  async chat({
    prompt,
    systemPrompt,
    user,
    conversationId,
  }: {
    prompt: string;
    systemPrompt: string;
    conversationId?: number;
    user: AuthUser;
  }) {
    const conversationMessages = await this.messageRepo.find({
      where: { conversation: { id: conversationId }, user: { id: user.id } },
      take: 20,
      select: { role: true, content: true, type: true, id: true },
    });
    const messages = z.array(BaseMessageSchema).parse(conversationMessages);

    const result = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      },
    );

    const data = await result.json();
    const jsonResponse = data.choices[0].message.content;
    const assistantResponse = AssistantResponseSchema.parse({
      role: 'assistant',
      ...JSON.parse(jsonResponse),
    });
    const { role, content, set, type } = assistantResponse;
    return await this.dataSource.transaction(async (m) => {
      let conversation = await m.findOne(Conversation, {
        where: { user: { id: user.id }, id: conversationId },
        select: { id: true },
      });

      if (!conversation) {
        const conversationValues = m.create(Conversation, {
          user: { id: user.id },
        });
        conversation = await m.save(conversationValues);
      }

      const userPrompt = m.create(Message, {
        role: 'user',
        content: prompt,
        user: { id: user.id },
        type: 'text',
        conversation: { id: conversation.id },
      });
      await m.save(userPrompt);
      let message = m.create(Message, {
        role,
        content,
        set,
        user: { id: user.id },
        type,
        conversation: { id: conversation.id },
      });

      await m.save(message);
      return {
        request: {
          role: 'user',
          content: prompt,
          type: 'text',
          id: userPrompt.id,
        },
        response: {
          role: 'assistant',
          content,
          type,
          id: message.id,
        },
        conversationId: conversation.id,
      };
    });
  }

  async createGeneratedSet({
    set,
    user,
  }: {
    set: GeneratedSet;
    user: AuthUser;
  }) {
    return await this.dataSource.transaction(async (m) => {
      const deckValues = m.create(Deck, {
        ...set,
        user: { id: user.id },
        flashcards: set.flashcards.map((f) => ({
          ...f,
          user: { id: user.id },
        })),
      });
      const createdSet = await m.save(Deck, deckValues);
      return createdSet;
    });
  }
}
