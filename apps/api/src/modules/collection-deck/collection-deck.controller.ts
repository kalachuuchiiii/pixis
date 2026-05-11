import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { CollectionDeckService } from './collection-deck.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { DeckSchema, IDSchema } from '@pixis/schemas';
import type { Request } from 'express';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('collection-deck')
export class CollectionDeckController {
  constructor(private readonly collectionDeckService: CollectionDeckService) {}

  @Get('/:collectionId')
  @UseGuards(AccessGuard)
  async getCollectionDecks(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    const { data, nextPage, totalItems } =
      await this.collectionDeckService.getCollectionDecks({
        query,
        collectionId,
        user,
      });
    const cleanDecks = z.array(DeckSchema).parse(data);
    return {
      decks: cleanDecks,
      nextPage,
      totalItems,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/:collectionId/:deckId')
  @UseGuards(AccessGuard)
  async addDeckToCollection(@Req() request: Request) {
    const deckId = IDSchema.parse(request.params.deckId);
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    const result = await this.collectionDeckService.addDeckToCollection({
      deckId,
      collectionId,
      user,
    });
    return {
      message: 'Added to collection!',
      result,
    };
  }
}
