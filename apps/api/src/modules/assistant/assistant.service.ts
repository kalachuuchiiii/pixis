import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import env from '../../config/env';
import { Deck } from '../deck/entities/deck.entity';
import { DataSource, type Repository } from 'typeorm';
import {
  AssistantResponseSchema,
  BaseMessageSchema,
  type GeneratedSet,
} from '@pixis/schemas';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';

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

  async getConversations({ user }: { user: AuthUser }) {
    const conversations = await this.conversationRepo.find({
      where: { user: { id: user.id } },
      select: { id: true, title: true, updatedAt: true },
      order: {
        updatedAt: 'DESC',
      },
    });
    return conversations;
  }

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
    const messages = await this.messageRepo.find({
      where: { user: { id: user.id }, conversation: { id: conversationId } },
      take: 6,
      select: {
        role: true,
        content: true,
        id: true,
      },
    });
    const previousMessages = z.array(BaseMessageSchema).parse(messages);

    const result = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            ...previousMessages,
            { role: 'user', content: prompt },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'assistant_response',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string' },
                  conversationTitle: { type: 'string' },
                  type: { type: 'string', enum: ['generate', 'text'] },
                  set: {
                    anyOf: [
                      {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          color: { type: 'string' },
                          topic: { type: 'string' },
                          flashcards: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['close_ended', 'open_ended'],
                                },
                                question: { type: 'string' },
                                answer: { type: 'string' },
                                choices: {
                                  anyOf: [
                                    {
                                      type: 'array',
                                      items: { type: 'string' },
                                    },
                                    {
                                      type: 'null',
                                    },
                                  ],
                                },
                                isAnswerCaseSensitive: { type: 'boolean' },
                              },
                              required: [
                                'type',
                                'question',
                                'answer',
                                'choices',
                                'isAnswerCaseSensitive',
                              ],
                              additionalProperties: false,
                            },
                          },
                        },
                        required: ['title', 'color', 'topic', 'flashcards'],
                        additionalProperties: false,
                      },
                      {
                        type: 'null',
                      },
                    ],
                  },
                },
                required: ['content', 'conversationTitle', 'type', 'set'],
                additionalProperties: false,
              },
            },
          },
        }),
      },
    );
    const data = await result.json();
    console.log(data);
    const jsonResponse = data.choices[0].message.content;
    const assistantResponse = AssistantResponseSchema.parse({
      role: 'assistant',
      visibility: 'public',
      ...JSON.parse(jsonResponse),
    });
    const { role, content, type, conversationTitle } = assistantResponse;
    return await this.dataSource.transaction(async (m) => {
      let conversation = await m.findOne(Conversation, {
        where: { user: { id: user.id }, id: conversationId },
        select: { id: true },
      });

      if (!conversation) {
        const conversationValues = m.create(Conversation, {
          user: { id: user.id },
          title: conversationTitle,
        });
        conversation = await m.save(conversationValues);
      } else {
        conversation.title = conversationTitle;
        await m.save(conversation);
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
        set:
          assistantResponse.type === 'generate'
            ? assistantResponse.set
            : undefined,
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
