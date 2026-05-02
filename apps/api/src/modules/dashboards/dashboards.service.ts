import { Injectable } from '@nestjs/common';
import { FlashcardProgress } from '../flashcard-progress/entities/flashcard-progress.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(FlashcardProgress)
    private readonly flashcardProgressRepo: Repository<FlashcardProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getDashboard;
}
