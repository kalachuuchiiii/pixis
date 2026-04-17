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
  deckWithAuthorAndFlashcardPreviewSchema,
  deckWithAuthorSchema,
  idSchema,
  rawDeckFormSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import z from 'zod';

import { Deck } from './entities/deck.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@Controller('decks')
export class DeckController {
  constructor(public service: DeckService) {}

  @Get('/archived')
  @UseGuards(AccessGuard)
  async getMyArchive(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const user = authPayloadSchema.parse(request.user);
    const { data, nextPage } = await this.service.getSoftDeletedDecks({
      query,
      user,
    });
    console.log(data);
    const archivedDecks = z.array(deckSchema).parse(data);
    return {
      archivedDecks,
      nextPage,
    };
  }

  @Get('/explore')
  @UseGuards(AccessGuard)
  async getPublicDecks(@Paginate() query: PaginateQuery) {
    const { data, nextPage } = await this.service.getDecks({ query });

    const cleanDecks = z
      .array(deckWithAuthorAndFlashcardPreviewSchema)
      .parse(data);
    return {
      decks: cleanDecks,
      nextPage,
    };
  }

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
    const { data, nextPage } = await this.service.getMyDecks({ query, user });
    const cleanData = z
      .array(deckWithAuthorAndFlashcardPreviewSchema)
      .max(query.limit ?? 10)
      .parse(data);

    return {
      decks: cleanData,
      nextPage,
    };
  }

  @Get(':deckId')
  @UseGuards(AccessGuard)
  async getMyDeck(@Req() request: Request) {
    const deckId = idSchema.parse(request.params.deckId);
    const user = authPayloadSchema.parse(request.user);
    const deck = await this.service.getDeckById({ deckId, user });
    console.log(deck);
    const cleanDeck = deckWithAuthorSchema.parse(deck);
    return {
      deck: cleanDeck,
    };
  }

  @Patch(':deckId')
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

  @Delete('/permanent/bulk')
  @UseGuards(AccessGuard)
  async deleteMyDecks(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    console.log(request.body);
    const deckIds = z.array(idSchema).parse(request.body.deckIds);
    await this.service.deleteDecks({ user, deckIds });
    return {
      message: `Successfully deleted ${deckIds.length} deck(s)`,
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

  @Patch('/restore/bulk')
  @UseGuards(AccessGuard)
  async restoreSelectedDecks(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const deckIds = z.array(idSchema).parse(request.body.deckIds);
    await this.service.restoreDecks({ user, deckIds });
    return {
      message: `Successfully restored ${deckIds.length} deck(s)`,
    };
  }
}
