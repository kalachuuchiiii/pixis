import { Test, TestingModule } from '@nestjs/testing';
import { UserSavedCollectionsController } from './user-saved-collections.controller';
import { UserSavedCollectionsService } from './user-saved-collections.service';

describe('UserSavedCollectionsController', () => {
  let controller: UserSavedCollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSavedCollectionsController],
      providers: [UserSavedCollectionsService],
    }).compile();

    controller = module.get<UserSavedCollectionsController>(UserSavedCollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
