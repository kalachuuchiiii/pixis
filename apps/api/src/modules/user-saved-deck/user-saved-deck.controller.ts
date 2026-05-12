import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserSavedDeckService } from './user-saved-deck.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { DeckSchema, IDSchema } from '@pixis/schemas';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('user-saved-deck')
export class UserSavedDeckController {
  constructor(private readonly userSavedDeckService: UserSavedDeckService) {}

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/:deckId')
  @UseGuards(AccessGuard)
  async saveDeck(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    const result = await this.userSavedDeckService.createSavedDeck({
      deckId,
      user,
    });
    console.log(result);
    return {
      result,
      message: 'Saved deck successfully!',
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Delete('/:deckId')
  @UseGuards(AccessGuard)
  async unsaveDeck(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    const result = await this.userSavedDeckService.deleteSavedDeck({
      deckId,
      user,
    });
    return {
      result,
      message: 'Unsaved deck successfully!',
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getMySavedDecks(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const user = AuthUserSchema.parse(request.user);

    const result = await this.userSavedDeckService.getUserSavedDecks({
      user,
      query,
    });
    const cleanDecks = z.array(DeckSchema).parse(result.data);
    return {
      decks: cleanDecks,
      ...result,
    };
  }
}
