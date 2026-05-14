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
import { UploadsService } from '../uploads/uploads.service';
import { responseFormat } from './data/responseFormat';
import { withRetry } from '@/common/utils/retry.util';

@Injectable()
export class AssistantService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly uploadsService: UploadsService,
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
    const limit = 10;
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
        'message.pdfName',
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

  async getChatContext({
    user,
    conversationId,
  }: {
    user: AuthUser;
    conversationId?: number;
  }) {
    if (!conversationId) return [];
    const messages = await this.messageRepo.find({
      where: { user: { id: user.id }, conversation: { id: conversationId } },
      take: 6,
      select: {
        role: true,
        content: true,
        id: true,
        pdfName: true,
      },
    });
    const previousMessages = z.array(BaseMessageSchema).parse(messages);
    return previousMessages;
  }

  async chat({
    prompt,
    pdf,
    systemPrompt,
    user,
    conversationId,
  }: {
    prompt: string;
    pdf?: Express.Multer.File;
    systemPrompt: string;
    conversationId?: number;
    user: AuthUser;
  }) {
    const previousMessages = await this.getChatContext({
      user,
      conversationId,
    });

    let finalPrompt = prompt;

    if (pdf) {
      const pdfText = await this.uploadsService.extractPdfText(pdf);
      finalPrompt = `${prompt} -- MORE CONTEXT = ${pdfText.text}`;
    }

    const result = await withRetry(async () => {
      return await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            ...previousMessages,
            { role: 'user', content: finalPrompt },
          ],
          response_format: responseFormat,
        }),
      });
    });
    const data = await result.json();
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

      console.log(pdf);

      const userPrompt = m.create(Message, {
        role: 'user',
        content: prompt,
        user: { id: user.id },
        type: 'text',
        pdfName: pdf?.filename,
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
          pdfName: pdf?.filename,
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
