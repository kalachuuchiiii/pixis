import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FlashcardProgressService } from './flashcard-progress.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import {
  examAnswersSchema,
  idSchema,
  resultDetailsSchema,
} from '@pixis/schemas';
import { authUserSchema } from '../auth/schemas/auth.schemas';

@Controller('flashcard-progress')
export class FlashcardProgressController {
  constructor(
    private readonly flashcardProgressService: FlashcardProgressService,
  ) {}

  @Post('/')
  @UseGuards(AccessGuard)
  async processExamAnswers(@Req() request: Request) {
    const sessionId = idSchema.parse(request.body.sessionId);
    const user = authUserSchema.parse(request.user);
    const examAnswers = examAnswersSchema.parse(request.body.examAnswers);
    const result = await this.flashcardProgressService.createProgresses({
      examAnswers,
      user,
      sessionId,
    });
    const cleanResult = resultDetailsSchema.parse(result);
    return {
      result: cleanResult,
    };
  }
}
