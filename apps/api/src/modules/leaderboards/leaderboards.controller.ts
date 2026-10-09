import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import { LeaderboardsService } from './leaderboards.service';
import type { Request } from 'express';
import { IDSchema, TopUserSchema } from '@pixis/schemas';
import z from 'zod';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) { }

  @Get('/:deckId/deck')
  @UseGuards(AccessGuard)
  async getDeckLeaderboards(@Req() request: Request) {
    const deckId = IDSchema.parse(request.params.deckId);
    const result = await this.leaderboardsService.getDeckLeaderboards({
      deckId,
    });
    const topUsers = z.array(TopUserSchema).parse(result);
    return {
      topUsers,
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getGlobalLeaderboard() {
    const data = await this.leaderboardsService.getLeaderboards();
    const topUsers = z.array(TopUserSchema).parse(data);
    return {
      topUsers,
    };
  }
}
