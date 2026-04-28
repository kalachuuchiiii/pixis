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
import {
  authPayloadSchema,
  flashcardFormSchema,
  flashcardSchema,
  idSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';

import z from 'zod';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}





  @Post('/decks/:deckId')
  @UseGuards(AccessGuard)
  async createFlashcard(@Req() request: Request) {
    const flashcardForm = flashcardFormSchema.parse(request.body);
    const user = authPayloadSchema.parse(request.user);
    const deckId = idSchema.parse(request.params.deckId);

    const flashcard = await this.flashcardService.createFlashcard({
      deckId,
      flashcardForm,
      user,
    });
    const cleanFlashcard = flashcardSchema.parse(flashcard);
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
    const deckId = idSchema.parse(request.params.deckId);
    const user = authPayloadSchema.parse(request.user);
    const { data, nextPage, totalItems } =
      await this.flashcardService.findAccessibleFlashcards({
        deckId,
        query,
        user
      });

    const flashcards = z.array(flashcardSchema).parse(data);

    return {
      flashcards,
      nextPage,
      totalFlashcards: totalItems,
    };
  }

  @Get('/:flashcardId')
  @UseGuards(AccessGuard)
  async getMyFlashcard(@Req() request: Request) {
    const flashcardId = idSchema.parse(request.params.flashcardId);
    const user = authPayloadSchema.parse(request.user);

    const flashcard = await this.flashcardService.findAccessibleFlashcardById({
      flashcardId,
      user,
    });

    const cleanFlashcard = flashcardSchema.parse(flashcard);
    return {
      flashcard: cleanFlashcard,
    };
  }

  @Patch('/:flashcardId')
  @UseGuards(AccessGuard)
  async updateMyFlashcard(@Req() request: Request) {
    const flashcardId = idSchema.parse(request.params.flashcardId);
    const user = authPayloadSchema.parse(request.user);
    const flashcardForm = flashcardFormSchema.parse(request.body);
    await this.flashcardService.updateFlashcard({
      user,
      flashcardForm,
      flashcardId,
    });

    return {
      message: 'Flashcard updated successfully!',
    };
  }

  @Delete('/:flashcardId')
  @UseGuards(AccessGuard)
  async softDeleteMyFlashcard(@Req() request: Request) {
    const flashcardId = idSchema.parse(request.params.flashcardId);
    const user = authPayloadSchema.parse(request.user);
    await this.flashcardService.softDeleteFlashcard({ flashcardId, user });

    return {
      message: 'Flashcard removed!',
    };
  }

  @Delete('/:flashcardId/permanent')
  @UseGuards(AccessGuard)
  async deleteMyFlashcard(@Req() request: Request) {
    const flashcardId = idSchema.parse(request.params.flashcardId);
    const user = authPayloadSchema.parse(request.user);
    await this.flashcardService.deleteFlashcard({ flashcardId, user });

    return {
      message: 'Flashcard deleted!',
    };
  }

  @Patch('/:flashcardId/restore')
  @UseGuards(AccessGuard)
  async restoreMyFlashcard(@Req() request: Request) {
    const flashcardId = idSchema.parse(request.params.flashcardId);
    const user = authPayloadSchema.parse(request.user);
    await this.flashcardService.restoreFlashcard({ flashcardId, user });

    return {
      message: 'Flashcard restored!',
    };
  }
}
