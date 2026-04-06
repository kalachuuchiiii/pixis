import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Flashcard } from '@pixis/schemas';
import type { AuthPayload } from '../auth/dtos/auth.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Deck } from '../deck/entities/deck.entity';
import type { Repository } from 'typeorm';
import { Flashcard as FlashcardEntity } from './entities/flashcard.entity';

@Injectable()
export class FlashcardService {


    constructor(@InjectRepository(Deck) private deckRepo: Repository<Deck>, @InjectRepository(FlashcardEntity) private flashcardRepo: Repository<FlashcardEntity>){}

    async createFlashcard(flashcard: Flashcard, myUser: AuthPayload){
      const myDeck = await this.deckRepo.find({ where: { id: flashcard.deckId, userId: myUser.id }});
      if(!myDeck){
        throw new ForbiddenException({ message: "This deck is not yours.", code: 'DECK_NOT_YOURS'});
      }

      const newFlashcard = this.flashcardRepo.create({ ...flashcard });
      return await this.flashcardRepo.save(newFlashcard);

    }

}
