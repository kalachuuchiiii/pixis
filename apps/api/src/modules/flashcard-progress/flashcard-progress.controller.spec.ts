import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardProgressController } from './flashcard-progress.controller';
import { FlashcardProgressService } from './flashcard-progress.service';

describe('FlashcardProgressController', () => {
  let controller: FlashcardProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardProgressController],
      providers: [FlashcardProgressService],
    }).compile();

    controller = module.get<FlashcardProgressController>(FlashcardProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
