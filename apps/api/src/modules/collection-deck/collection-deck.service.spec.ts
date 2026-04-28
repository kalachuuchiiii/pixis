import { Test, TestingModule } from '@nestjs/testing';
import { CollectionDeckService } from './collection-deck.service';

describe('CollectionDeckService', () => {
  let service: CollectionDeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionDeckService],
    }).compile();

    service = module.get<CollectionDeckService>(CollectionDeckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
