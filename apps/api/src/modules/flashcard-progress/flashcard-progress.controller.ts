import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FlashcardProgressService } from './flashcard-progress.service';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { authPayloadSchema, examAnswersSchema, idSchema } from '@pixis/schemas';

@Controller('flashcard-progress')
export class FlashcardProgressController {
  constructor(
    private readonly flashcardProgressService: FlashcardProgressService,
  ) {}

  @Post('/')
  @UseGuards(AccessGuard)
  async processExamAnswers(@Req() request: Request) {
    console.log(request.body);
    const sessionId = idSchema.parse(request.body.sessionId);
    const user = authPayloadSchema.parse(request.user);
    const examAnswers = examAnswersSchema.parse(request.body.examAnswers);
    const result = await this.flashcardProgressService.createProgresses({
      examAnswers,
      user,
      sessionId,
    });
    return result;
  }
}
