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
  DeckSchema,
  IDSchema,
  DeckFormSchema,
  SessionSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import z from 'zod';

import { Deck } from './entities/deck.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SessionService } from '../session/session.service';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('decks')
export class DeckController {
  constructor(
    public service: DeckService,
    private sessionService: SessionService,
  ) {}

  @Get('/:deckId/sessions')
  @UseGuards(AccessGuard)
  async findDeckSessions(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const deckId = IDSchema.parse(request.params.deckId);
    const user = AuthUserSchema.parse(request.user);
    const result = await this.sessionService.findAccessibleSessionsByDeckId({
      deckId,
      user,
      query,
    });
    const sessions = z.array(SessionSchema).parse(result.data);
    return {
      ...result,
      sessions,
    };
  }

  @Get('/archived')
  @UseGuards(AccessGuard)
  async getMyArchive(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const user = AuthUserSchema.parse(request.user);
    const { data, nextPage } = await this.service.getSoftDeletedDecks({
      query,
      user,
    });
    const archivedDecks = z.array(DeckSchema).parse(data);
    return {
      archivedDecks,
      nextPage,
    };
  }

  @Get('/explore')
  @UseGuards(AccessGuard)
  async getPublicDecks(@Paginate() query: PaginateQuery) {
    const { data, nextPage } = await this.service.findAccessibleDecks({
      query,
    });

    const cleanDecks = z.array(DeckSchema).parse(data);
    return {
      decks: cleanDecks,
      nextPage,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/')
  @UseGuards(AccessGuard)
  async createDeck(@Req() request: Request) {
    const deckForm = DeckFormSchema.parse(request.body);
    const user = AuthUserSchema.parse(request.user);
    await this.service.createDeck({ deckForm, user });
    return {
      message: 'Deck created successfully!',
    };
  }

  @Get('/:userId/list')
  @UseGuards(AccessGuard)
  async getDecks(@Req() request: Request, @Paginate() query: PaginateQuery) {
    const user = AuthUserSchema.parse(request.user);
    const userId = IDSchema.parse(request.params.userId);
    const { data, nextPage } = await this.service.findAccessibleDecksByUserId({
      query,
      userId,
      user,
    });
    const cleanData = z.array(DeckSchema).parse(data);

    return {
      decks: cleanData,
      nextPage,
    };
  }

  @Get('/:deckId')
  @UseGuards(AccessGuard)
  async getDeck(@Req() request: Request) {
    const deckId = IDSchema.parse(request.params.deckId);
    const user = AuthUserSchema.parse(request.user);
    const deck = await this.service.findAccessibleDeckById({
      deckId,
      user,
    });
    const cleanDeck = DeckSchema.parse(deck);
    return {
      deck: cleanDeck,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Patch('/:deckId')
  @UseGuards(AccessGuard)
  async updateMyDeck(@Req() request: Request) {
    const deckForm = DeckFormSchema.parse(request.body);
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    await this.service.updateDeck({ deckForm, user, deckId });
    return {
      message: 'Deck updated successfully!',
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Delete('/:deckId')
  @UseGuards(AccessGuard)
  async softDeleteMyDeck(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    await this.service.softDeleteDeck({ user, deckId });
    return {
      message: 'Removed Deck',
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Delete('/:deckId/permanent')
  @UseGuards(AccessGuard)
  async deleteMyDeck(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    await this.service.deleteDeck({ user, deckId });
    return {
      message: 'Deleted Deck',
    };
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Delete('/permanent/bulk')
  @UseGuards(AccessGuard)
  async deleteMyDecks(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckIds = z.array(IDSchema).parse(request.body.deckIds);
    await this.service.deleteDecks({ user, deckIds });
    return {
      message: `Successfully deleted ${deckIds.length} deck(s)`,
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Patch('/:deckId/restore')
  @UseGuards(AccessGuard)
  async restoreMyDeck(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);
    await this.service.restoreDeck({ user, deckId });
    return {
      message: 'Restored Deck',
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Patch('/restore/bulk')
  @UseGuards(AccessGuard)
  async restoreSelectedDecks(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const deckIds = z.array(IDSchema).parse(request.body.deckIds);
    await this.service.restoreDecks({ user, deckIds });
    return {
      message: `Successfully restored ${deckIds.length} deck(s)`,
    };
  }
}
