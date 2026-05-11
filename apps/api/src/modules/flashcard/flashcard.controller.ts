import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import type { Request } from 'express';
import { FlashcardFormSchema, FlashcardSchema, IDSchema } from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';

import z from 'zod';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('/decks/:deckId')
  @UseGuards(AccessGuard)
  async createFlashcard(@Req() request: Request) {
    const flashcardForm = FlashcardFormSchema.parse(request.body);
    const user = AuthUserSchema.parse(request.user);
    const deckId = IDSchema.parse(request.params.deckId);

    const flashcard = await this.flashcardService.createFlashcard({
      deckId,
      flashcardForm,
      user,
    });
    const cleanFlashcard = FlashcardSchema.parse(flashcard);
    return {
      flashcard: cleanFlashcard,
      message: 'New flashcard was created!',
    };
  }

  @Get('/decks/:deckId')
  @UseGuards(AccessGuard)
  async getDeckFlashcards(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const deckId = IDSchema.parse(request.params.deckId);
    const user = AuthUserSchema.parse(request.user);
    const { data, nextPage, totalItems } =
      await this.flashcardService.findAccessibleFlashcardsByDeckId({
        deckId,
        query,
        user,
      });

    const flashcards = z.array(FlashcardSchema).parse(data);

    return {
      flashcards,
      nextPage,
      totalFlashcards: totalItems,
    };
  }

  @Get('/:flashcardId')
  @UseGuards(AccessGuard)
  async getMyFlashcard(@Req() request: Request) {
    const flashcardId = IDSchema.parse(request.params.flashcardId);
    const user = AuthUserSchema.parse(request.user);

    const flashcard = await this.flashcardService.findAccessibleFlashcardById({
      flashcardId,
      user,
    });
    const cleanFlashcard = FlashcardSchema.parse(flashcard);
    return {
      flashcard: cleanFlashcard,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Patch('/:flashcardId')
  @UseGuards(AccessGuard)
  async updateMyFlashcard(@Req() request: Request) {
    const flashcardId = IDSchema.parse(request.params.flashcardId);
    const user = AuthUserSchema.parse(request.user);
    const flashcardForm = FlashcardFormSchema.parse(request.body);
    await this.flashcardService.updateFlashcard({
      user,
      flashcardForm,
      flashcardId,
    });

    return {
      message: 'Flashcard updated successfully!',
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Delete('/:flashcardId/permanent')
  @UseGuards(AccessGuard)
  async deleteMyFlashcard(@Req() request: Request) {
    const flashcardId = IDSchema.parse(request.params.flashcardId);
    const user = AuthUserSchema.parse(request.user);
    await this.flashcardService.deleteFlashcardById({ flashcardId, user });

    return {
      message: 'Flashcard deleted!',
    };
  }
}
