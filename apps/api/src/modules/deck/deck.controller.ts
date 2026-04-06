import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DeckService } from './deck.service';
import type { Request } from 'express';
import { authPayloadSchema, deckFilterParamsSchema, idSchema, rawDeckFormSchema } from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}


  @Post('/')
  @UseGuards(AccessGuard)
  async createDeck(@Req() request: Request){
    const deckForm = rawDeckFormSchema.parse(request.body);
    const myUser = authPayloadSchema.parse(request.user);
    return await this.deckService.createDeck(deckForm, myUser);
  }

  @Get('/me')
  @UseGuards(AccessGuard)
  async getDecks(@Req() request: Request){
    const params = deckFilterParamsSchema.parse(request.query);
    const myUser = authPayloadSchema.parse(request.user);
    return await this.deckService.getMyDecks({ ...params, myUser });
  }

  @Get('/me/:deckId')
  @UseGuards(AccessGuard)
  async getMyDeck(@Req() request: Request){
    const deckId = idSchema.parse(request.params.deckId);
    const myUser = authPayloadSchema.parse(request.user);
    const deck = await this.deckService.getMyDeckById(deckId, myUser);
    return {
      deck 
    }
  }

}
