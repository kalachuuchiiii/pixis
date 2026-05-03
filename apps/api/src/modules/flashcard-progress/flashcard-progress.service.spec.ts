import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardProgressService } from './flashcard-progress.service';

describe('FlashcardProgressService', () => {
  let service: FlashcardProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardProgressService],
    }).compile();

    service = module.get<FlashcardProgressService>(FlashcardProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
