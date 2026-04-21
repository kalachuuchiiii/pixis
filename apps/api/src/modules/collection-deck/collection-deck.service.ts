import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionDeck } from './entities/collection-deck.entity';
import { DataSource, Repository } from 'typeorm';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { CollectionsService } from '../collections/collections.service';
import { DeckService } from '../deck/deck.service';
import { paginate, type PaginateQuery } from 'nestjs-paginate';
import { getNextPage } from '@/common/utils/pagination.util';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CollectionDeckService {
  constructor(
    @InjectRepository(CollectionDeck)
    private readonly collectionDeckRepo: Repository<CollectionDeck>,
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
    user: AuthPayload;
    collectionId: number;
  }) {
    const [deck, collection, isCollectionDeckExisting] = await Promise.all([
      this.deckService.getDeck({ deckId, user }),
      this.collectionService.getCollection({ collectionId, user }),
      this.collectionDeckRepo.exists({ where: { collection: { id: collectionId }, deck: { id: deckId }}}),
    ]);

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
    user: AuthPayload;
  }) {
    await this.collectionService.getCollection({
      collectionId,
      user,
    });

    const qb =
      await this.collectionDeckRepo.createQueryBuilder('cd').leftJoinAndSelect('cd.deck', 'deck');

    const {
      data,
      links,
      meta: { totalItems },
    } = await paginate(query, qb, {
      sortableColumns: ['collection'],
    });

    console.log(data);

    return {
      data,
      nextPage: getNextPage(links, query.page),
      totalItems,
    };
  }
}
  