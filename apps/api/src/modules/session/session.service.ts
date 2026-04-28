import { Injectable, NotFoundException } from '@nestjs/common';
import type { ExamMode } from '@pixis/constants';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Equal, IsNull, Not, Repository } from 'typeorm';

export interface SessionProps {
  deckId: number;
  mode: ExamMode;
  user: AuthPayload;
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
    throwErrorOnNotFound = true,
  }: {
    sessionId: number;
    user: AuthPayload;
    throwErrorOnNotFound?: boolean;
  }) {
    const session = await this.sessionRepo
      .createQueryBuilder('session')
      .where('session.user.id = :userId AND session.id = :sessionId', {
        userId: user.id,
        sessionId,
      })
      .leftJoinAndSelect(
        'session.deck',
        'deck',
        '(deck.visibility != :visibility OR deck.user.id = :userId)',
        { visibility: 'private', userId: user.id },
      )
      .select(['session', 'deck.id'])
      .getOne();

    console.log(session);

    if (!session && throwErrorOnNotFound) {
      throw new NotFoundException({
        message: 'Exam session not found',
        code: 'EXAM_SESSION_NOT_FOUND',
      });
    }
    return session;
  }
}
