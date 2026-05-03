import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionDeck } from './entities/collection-deck.entity';
import { DataSource, Equal, Not, Repository } from 'typeorm';
import { CollectionsService } from '../collections/collections.service';
import { DeckService } from '../deck/deck.service';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { getNextPage, getPaginationData } from '@/common/utils/pagination.util';
import { User } from '../users/entities/user.entity';
import { Deck } from '../deck/entities/deck.entity';
import { deckPaginationConfig } from '@/config/paginationConfigs';
import type { AuthUser } from '../auth/schemas/auth.schemas';

@Injectable()
export class CollectionDeckService {
  constructor(
    @InjectRepository(CollectionDeck)
    private readonly collectionDeckRepo: Repository<CollectionDeck>,
    @InjectRepository(Deck) private readonly deckRepo: Repository<Deck>,
    public collectionService: CollectionsService,
    public deckService: DeckService,
    public dataSource: DataSource,
  ) {}

  async addDeckToCollection({
    deckId,
    user,
    collectionId,
  }: {
    deckId: number;
    user: AuthUser;
    collectionId: number;
  }) {
    const isCollectionDeckExisting = await this.collectionDeckRepo.exists({
      where: {
        collection: { id: collectionId, user: { id: user.id } },
        deck: [
          { id: deckId, visibility: Not(Equal('private')) },
          { id: deckId, user: { id: user.id } },
        ],
      },
    });

    if (isCollectionDeckExisting) {
      throw new ConflictException({
        message: 'This deck is already in this collection',
        code: 'DECK_ALREADY_IN_COLLECTION',
      });
    }

    const collectionDeck = this.collectionDeckRepo.create({
      deck: { id: deckId },
      collection: { id: collectionId },
      user: { id: user.id },
    });
    const result = await this.collectionDeckRepo.save(collectionDeck);
    return result;
  }

  async getCollectionDecks({
    collectionId,
    user,
    query,
  }: {
    query: PaginateQuery;
    collectionId: number;
    user: AuthUser;
  }) {
    const qb = this.deckRepo
      .createQueryBuilder('deck')
      .leftJoin('deck.collectionDecks', 'cds')
      .leftJoin('cds.collection', 'c')
      .where('c.id = :collectionId', { collectionId })
      .andWhere('(c.user.id = :userId OR c.visibility != :visibility)', {
        userId: user.id,
        visibility: 'private',
      })
      .andWhere('(deck.user.id = :userId OR deck.visibility != :visibility)', {
        userId: user.id,
        visibility: 'private',
      })
      .loadRelationCountAndMap('deck.flashcardCount', 'deck.flashcards')
      .loadRelationCountAndMap(
        'deck.userSavedDeckCount',
        'deck.userSavedDecks',
      );

    const result = await paginate(query, qb, deckPaginationConfig);

    return getPaginationData(result);
  }
}
