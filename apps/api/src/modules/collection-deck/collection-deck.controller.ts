import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CollectionDeckService } from './collection-deck.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { authPayloadSchema, deckSchema, deckWithAuthorSchema, idSchema } from '@pixis/schemas';
import type { Request } from 'express';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';

@Controller('collection-deck')
export class CollectionDeckController {
  constructor(private readonly collectionDeckService: CollectionDeckService) {}

  
  @Get('/:collectionId')
  @UseGuards(AccessGuard)
  async getCollectionDecks(@Req() request: Request, @Paginate() query: PaginateQuery) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
    const { data, nextPage, totalItems } = await this.collectionDeckService.getCollectionDecks({
      query,
      collectionId,
      user,
    });
    const cleanDecks = z.array(deckSchema).parse(data.map((d) => d.deck));
    return {
      decks: cleanDecks,
      nextPage,
      totalItems
    };
  }

  @Post('/:collectionId/:deckId')
  @UseGuards(AccessGuard)
  async addDeckToCollection(@Req() request: Request) {
    const deckId = idSchema.parse(request.params.deckId);
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
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
