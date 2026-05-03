import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { examModeSchema, idSchema, sessionSchema } from '@pixis/schemas';
import { authUserSchema } from '../auth/schemas/auth.schemas';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/:deckId')
  @UseGuards(AccessGuard)
  async createNewSession(@Req() request: Request) {
    const deckId = idSchema.parse(request.params.deckId);
    const mode = examModeSchema.parse(request.body.mode);
    const user = authUserSchema.parse(request.user);
    const data = await this.sessionService.create({ deckId, mode, user });
    return {
      sessionId: data.id,
    };
  }

  @Get('/:sessionId')
  @UseGuards(AccessGuard)
  async getSession(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const sessionId = idSchema.parse(request.params.sessionId);
    const session = await this.sessionService.findAccessibleSessionById({
      sessionId,
      user,
    });
    return {
      session,
    };
  }
}
