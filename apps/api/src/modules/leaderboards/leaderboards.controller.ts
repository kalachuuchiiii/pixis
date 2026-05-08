import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import { LeaderboardsService } from './leaderboards.service';
import type { Request } from 'express';
import {
  topDeckUserSchema,
  idSchema,
  userBadgeSchema,
  topGlobalUserSchema,
  topUserSchema,
} from '@pixis/schemas';
import z from 'zod';
import { authUserSchema } from '../auth/schemas/auth.schemas';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('/:deckId/deck')
  @UseGuards(AccessGuard)
  async getDeckLeaderboards(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    const result = await this.leaderboardsService.getDeckLeaderboards({
      user,
      deckId,
    });
    const topUsers = z.array(topUserSchema).parse(result);
    return {
      topUsers,
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getGlobalLeaderboard(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const data = await this.leaderboardsService.getLeaderboards();
    const topUsers = z.array(topUserSchema).parse(data);

    return {
      topUsers,
    };
  }
}
