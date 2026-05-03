import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsController } from './leaderboards.controller';

describe('LeaderboardsController', () => {
  let controller: LeaderboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsController],
    }).compile();

    controller = module.get<LeaderboardsController>(LeaderboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
