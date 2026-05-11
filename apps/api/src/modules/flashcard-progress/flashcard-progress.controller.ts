import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FlashcardProgressService } from './flashcard-progress.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import {
  ExamAnswersSchema,
  IDSchema,
  ResultDetailsSchema,
} from '@pixis/schemas';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('flashcard-progress')
export class FlashcardProgressController {
  constructor(
    private readonly flashcardProgressService: FlashcardProgressService,
  ) {}

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/')
  @UseGuards(AccessGuard)
  async processExamAnswers(@Req() request: Request) {
    const sessionId = IDSchema.parse(request.body.sessionId);
    const user = AuthUserSchema.parse(request.user);
    const examAnswers = ExamAnswersSchema.parse(request.body.examAnswers);
    const result = await this.flashcardProgressService.createProgresses({
      examAnswers,
      user,
      sessionId,
    });
    const cleanResult = ResultDetailsSchema.parse(result);
    return {
      result: cleanResult,
    };
  }
}
