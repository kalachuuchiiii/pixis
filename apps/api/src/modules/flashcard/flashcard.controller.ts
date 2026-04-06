import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import type { Request } from 'express';
import { authPayloadSchema, flashcardSchema, idSchema } from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Post('/')
  @UseGuards(AccessGuard)
  async createFlashcard (@Req() request: Request) {
    const flashcard = flashcardSchema.parse(request.body);
    const myUser = authPayloadSchema.parse(request.user);

    return await this.flashcardService.createFlashcard(flashcard, myUser);
  }

  @Get('/decks/:deckId')
  @UseGuards(AccessGuard)
  async getDecksFlashcards (@Req() request: Request){
    const deckId = idSchema.parse(request.params.deckId);
    const myUser = authPayloadSchema.parse(request.user);
  }

}
