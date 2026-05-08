import { Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  idSchema,
  updateUserFormSchema,
  userWithStatsSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { authUserSchema } from '../auth/schemas/auth.schemas';
import { DeckService } from '../deck/deck.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly decksService: DeckService,
  ) {}

  @Patch('/me')
  @UseGuards(AccessGuard)
  async updateUser(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const form = updateUserFormSchema.parse(request.body);

    return await this.usersService.updateUser({ user, form });
  }

  @Get('/:userId/history')
  @UseGuards(AccessGuard)
  async getHistory(@Req() request: Request) {
    const userId = idSchema.parse(request.params.userId);
    const lastThreeDecks =
      await this.decksService.getLatestDecksAnsweredByUserId({
        userId,
      });
    return {
      decks: lastThreeDecks,
    };
  }

  @Get('/me/profile')
  @UseGuards(AccessGuard)
  async getProfile(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const result = await this.usersService.getUserById(user.id);
    const userWithStats = userWithStatsSchema.parse(result);
    return {
      user: userWithStats,
    };
  }

  @Patch('/me/privacy')
  @UseGuards(AccessGuard)
  async togglePrivacy(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    return await this.usersService.togglePrivacy(user);
  }

  @Delete('/me')
  @UseGuards(AccessGuard)
  async deleteAccount(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    await this.usersService.deleteAccount(user);
    return {
      message: `Deleted ${user.username}`,
    };
  }
}
