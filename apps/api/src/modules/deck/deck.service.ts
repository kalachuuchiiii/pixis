import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { RawDeckForm, DeckFilterParams, Id } from '@pixis/schemas';
import { Deck } from './entities/deck.entity';
import type { Repository } from 'typeorm';
import type { AuthPayload } from '../auth/dtos/auth.dtos';

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(Deck) private readonly deckRepo: Repository<Deck>,
  ) {}

  async createDeck(form: RawDeckForm, user: AuthPayload) {
    const newDeck = this.deckRepo.create({ ...form, userId: user.id });
    return await this.deckRepo.save(newDeck);
  }

  async getMyDecks({
    myUser,
    limit,
    page,
    sortBy,
  }: DeckFilterParams & { myUser: AuthPayload }) {
    const decks = await this.deckRepo.find({
      where: { userId: myUser.id },
      order: {
        [sortBy]: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit + 1,
    });
    const hasNextPage = decks.length === limit + 1;

    return {
      hasNextPage,
      decks: hasNextPage ? decks.slice(0, limit) : decks,
    };
  }

  async getMyDeckById(id: Id, myUser: AuthPayload) {
    const deck = await this.deckRepo
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.user', 'user')
      .where('deck.id = :id AND deck.userId = :userId', {
        id,
        userId: myUser.id,
      }).select(['deck', 'user.username', 'user.nickname', 'user.avatarPublicUrl']).getOne();

    if (!deck) {
      throw new NotFoundException({
        message: 'Deck not found.',
        code: 'DECK_NOT_FOUND',
      });
    }
    return deck;
  }
}
