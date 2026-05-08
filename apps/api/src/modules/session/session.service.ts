import { Injectable, NotFoundException } from '@nestjs/common';
import type { ExamMode } from '@pixis/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import {
  Equal,
  IsNull,
  Not,
  Repository,
  type DeepPartial,
  type FindOptionsWhere,
  type ObjectId,
} from 'typeorm';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { sessionPaginationConfig } from '@/config/paginationConfigs';
import { getPaginationData } from '@/common/utils/pagination.util';
import type { AuthUser } from '../auth/schemas/auth.schemas';

export interface SessionProps {
  deckId: number;
  mode: ExamMode;
  user: AuthUser;
}

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async create({ deckId, mode, user }: SessionProps) {
    const newSession = this.sessionRepo.create({
      deck: { id: deckId },
      user: { id: user.id },
      mode,
    });

    return await this.sessionRepo.save(newSession);
  }

  async findAccessibleSessionById({
    sessionId,
    user,
    mode,
    throwErrorOnNotFound = true,
  }: {
    sessionId: number;
    user: AuthUser;
    mode: ExamMode;
    throwErrorOnNotFound?: boolean;
  }) {
    const session = await this.sessionRepo
      .createQueryBuilder('session')
      .where(
        'session.user.id = :userId AND session.id = :sessionId AND session.mode = :mode AND session.finishedAt IS NULL AND session.abandonedAt IS NULL',
        {
          userId: user.id,
          finishedAt: undefined,
          abandonedAt: undefined,
          sessionId,
          mode,
        },
      )
      .leftJoinAndSelect(
        'session.deck',
        'deck',
        '(deck.visibility != :visibility OR deck.user.id = :userId)',
        { visibility: 'private', userId: user.id },
      )
      .leftJoin('deck.flashcards', 'flashcards')
      .groupBy('session.id')
      .addGroupBy('deck.id')
      .having('COUNT(flashcards) > 0')
      .select(['session', 'deck.id'])
      .getOne();

    if (!session && throwErrorOnNotFound) {
      throw new NotFoundException({
        message: 'Exam session not found',
        code: 'EXAM_SESSION_NOT_FOUND',
      });
    }
    return session;
  }

  async findAccessibleSessionsByDeckId({
    user,
    deckId,
    query,
  }: {
    user: AuthUser;
    deckId: number;
    query: PaginateQuery;
  }) {
    const qb = this.sessionRepo
      .createQueryBuilder('session')
      .where('session.user.id = :userId AND session.deck.id = :deckId', {
        userId: user.id,
        deckId,
      })
      .orderBy('session.createdAt', 'DESC');
    const result = await paginate(query, qb, sessionPaginationConfig);
    return getPaginationData(result);
  }
}
