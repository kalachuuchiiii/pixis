import { Test, TestingModule } from '@nestjs/testing';
import { UserSavedCollectionsService } from './user-saved-collections.service';

describe('UserSavedCollectionsService', () => {
  let service: UserSavedCollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSavedCollectionsService],
    }).compile();

    service = module.get<UserSavedCollectionsService>(UserSavedCollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
