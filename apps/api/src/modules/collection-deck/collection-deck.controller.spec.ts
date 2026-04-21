import { Test, TestingModule } from '@nestjs/testing';
import { CollectionDeckController } from './collection-deck.controller';
import { CollectionDeckService } from './collection-deck.service';

describe('CollectionDeckController', () => {
  let controller: CollectionDeckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionDeckController],
      providers: [CollectionDeckService],
    }).compile();

    controller = module.get<CollectionDeckController>(CollectionDeckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
