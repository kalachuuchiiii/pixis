import { Test, TestingModule } from '@nestjs/testing';
import { UserSavedDeckService } from './user-saved-deck.service';

describe('UserSavedDeckService', () => {
  let service: UserSavedDeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSavedDeckService],
    }).compile();

    service = module.get<UserSavedDeckService>(UserSavedDeckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
