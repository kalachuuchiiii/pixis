import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { ExamModeSchema, IDSchema } from '@pixis/schemas';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/:deckId')
  @UseGuards(AccessGuard)
  async createNewSession(@Req() request: Request) {
    const deckId = IDSchema.parse(request.params.deckId);
    const mode = ExamModeSchema.parse(request.body.mode);
    const user = AuthUserSchema.parse(request.user);
    const data = await this.sessionService.create({ deckId, mode, user });
    return {
      sessionId: data.id,
    };
  }

  @Get('/:sessionId')
  @UseGuards(AccessGuard)
  async getSession(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const sessionId = IDSchema.parse(request.params.sessionId);
    const mode = ExamModeSchema.parse(request.query.mode);
    const session = await this.sessionService.findAccessibleSessionById({
      sessionId,
      mode,
      user,
    });
    return {
      session,
    };
  }
}
