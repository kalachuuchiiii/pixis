import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserSavedDeckService } from './user-saved-deck.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { authPayloadSchema, deckSchema, idSchema } from '@pixis/schemas';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';

@Controller('user-saved-deck')
export class UserSavedDeckController {
  constructor(private readonly userSavedDeckService: UserSavedDeckService) {}

  @Post('/:deckId')
  @UseGuards(AccessGuard)
  async saveDeck(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    const result = await this.userSavedDeckService.createSavedDeck({
      deckId,
      user,
    });
    return {
      result,
      message: 'Saved deck successfully!',
    };
  }

  @Delete('/:deckId')
  @UseGuards(AccessGuard)
  async unsaveDeck(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
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
  async getMySavedDecks(@Req() request: Request, @Paginate() query: PaginateQuery){
   const user = authPayloadSchema.parse(request.user);
   
    const result = await this.userSavedDeckService.getUserSavedDecks({ user, query });
    const cleanDecks = z.array(deckSchema).parse(result.data);
    return {
      decks: cleanDecks,
      ...result
    }
  }
}
