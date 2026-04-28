import { Test, TestingModule } from '@nestjs/testing';
import { UserSavedDeckController } from './user-saved-deck.controller';
import { UserSavedDeckService } from './user-saved-deck.service';

describe('UserSavedDeckController', () => {
  let controller: UserSavedDeckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSavedDeckController],
      providers: [UserSavedDeckService],
    }).compile();

    controller = module.get<UserSavedDeckController>(UserSavedDeckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
