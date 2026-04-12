import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import type { Request } from 'express';
import {
  authPayloadSchema,
  deckSchema,
  idSchema,
  rawDeckFormSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import z from 'zod';

import { Crud, CrudController } from '@dataui/crud';
import { Deck } from './entities/deck.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@Crud({
  model: {
    type: Deck,
  },
})
@Controller('decks')
export class DeckController implements CrudController<Deck> {
  constructor(public service: DeckService) {}

  @Post('/')
  @UseGuards(AccessGuard)
  async createDeck(@Req() request: Request) {
    const deckForm = rawDeckFormSchema.parse(request.body);
    const user = authPayloadSchema.parse(request.user);
    await this.service.createDeck({ deckForm, user });
    return {
      message: 'Deck created successfully!',
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getMyDecks(@Req() request: Request, @Paginate() query: PaginateQuery) {
    const user = authPayloadSchema.parse(request.user);
    const { data, nextPage } = await this.service.getDecks({ query, user });
    const cleanData = z.array(deckSchema).max(query.limit ?? 10).parse(data);
 
    return {
       decks: cleanData,
       nextPage
    };
  }

  @Get('/explore')  
  async getPublicDecks(@Req() request: Request) {
    
  }

  @Get('/archive')
  @UseGuards(AccessGuard)
  async getMyArchive(@Req() request: Request) {
    
    const user = authPayloadSchema.parse(request.user);
  }

  @Get('/:deckId')
  @UseGuards(AccessGuard)
  async getMyDeck(@Req() request: Request) {
    const deckId = idSchema.parse(request.params.deckId);
    const user = authPayloadSchema.parse(request.user);
    const deck = await this.service.getDeckById({ deckId, user });
    const cleanDeck = rawDeckFormSchema.parse(deck);
    return {
      deck: cleanDeck,
    };
  }

  @Patch('/:deckId')
  @UseGuards(AccessGuard)
  async updateMyDeck(@Req() request: Request) {
    const deckForm = rawDeckFormSchema.parse(request.body);
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    await this.service.updateDeck({ deckForm, user, deckId });
    return {
      message: 'Deck updated successfully!',
    };
  }

  @Delete('/:deckId')
  @UseGuards(AccessGuard)
  async softDeleteMyDeck(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    await this.service.softDeleteDeck({ user, deckId });
    return {
      message: 'Removed Deck',
    };
  }

  @Delete('/:deckId/permanent')
  @UseGuards(AccessGuard)
  async deleteMyDeck(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    await this.service.deleteDeck({ user, deckId });
    return {
      message: 'Deleted Deck',
    };
  }

  @Patch('/:deckId/restore')
  @UseGuards(AccessGuard)
  async restoreMyDeck(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);
    await this.service.restoreDeck({ user, deckId });
    return {
      message: 'Restored Deck',
    };
  }
}
