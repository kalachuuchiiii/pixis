import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { DeckService } from '../deck/deck.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSavedDeck } from './entities/user-saved-deck.entity';
import { Equal, Not, Repository } from 'typeorm';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { Deck } from '../deck/entities/deck.entity';
import { getNextPage } from '@/common/utils/pagination.util';
import { deckPaginationConfig } from '@/config/pagination.config';

interface DeckIdWithUser {
  deckId: number;
  user: AuthPayload;
}

@Injectable()
export class UserSavedDeckService {
  constructor(
    private readonly deckService: DeckService,
    @InjectRepository(UserSavedDeck)
    private userSavedDeckRepo: Repository<UserSavedDeck>,
    @InjectRepository(Deck) private deckRepo: Repository<Deck>,
  ) {}

  async createSavedDeck({ deckId, user }: DeckIdWithUser) {
    await this.deckService.findAccessibleDeck({ deckId, user });
    const newSavedDeck = this.userSavedDeckRepo.create({
      deck: { id: deckId },
      user: { id: user.id },
    });
    return await this.userSavedDeckRepo.save(newSavedDeck);
  }

  async findAccessibleSavedDeck({
    deckId,
    user,
    throwOnNotFound = false,
  }: DeckIdWithUser & { throwOnNotFound: boolean }) {
    const savedDeck = await this.userSavedDeckRepo.findOne({
      where: [
        {
          deck: { id: deckId, visibility: Not(Equal('private')) },
        },
        {
          user: { id: user.id },
        },
      ],
    });

    if (!savedDeck && throwOnNotFound) {
      throw new NotFoundException({
        message: 'Saved deck not found',
      });
    }

    return savedDeck;
  }

  async deleteSavedDeck({ deckId, user }: DeckIdWithUser) {
    return await this.userSavedDeckRepo.delete({
      deck: { id: deckId },
      user: { id: user.id },
    });
  }

   findAccessibleSavedDecks({ user }: { user?: AuthPayload } = {}) {
    return this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.userSavedDecks', 'usds')
      .leftJoin('usds.user', 'user')
      .where('user.id = :userId', { userId: user?.id })
      .andWhere('(deck.user.id = :userId OR deck.visibility != :visibility)', {
        visibility: 'private',
        userId: user?.id,
      })
      .loadRelationCountAndMap('deck.flashcardCount', 'deck.flashcards')
      .loadRelationCountAndMap(
        'deck.userSavedDeckCount',
        'deck.userSavedDecks',
      );
  }

  async getUserSavedDecks({
    user,
    query,
  }: {
    user: AuthPayload;
    query: PaginateQuery;
  }) {
    const qb = this.findAccessibleSavedDecks({ user });
    const { data, links } = await paginate(query, qb, deckPaginationConfig);

    return {
      data,
      nextPage: getNextPage(links, query.page),
    };
  }
}
