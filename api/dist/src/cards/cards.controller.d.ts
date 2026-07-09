import { CardsService } from './cards.service';
import { User } from "../users/schemas/user.schema";
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './schemas/card.schema';
import { UpdateCardDto } from './dtos/update-card.dto';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    findAll(deckId: string, user: Omit<User, 'password'>): Promise<Card[]>;
    findOne(deckId: string, cardId: string, user: Omit<User, 'password'>): Promise<Card>;
    create(deckId: string, user: Omit<User, 'password'>, createCardDto: CreateCardDto): Promise<Card>;
    update(deckId: string, cardId: string, user: Omit<User, 'password'>, updateCardDto: UpdateCardDto): Promise<Card>;
    delete(deckId: string, cardId: string, user: Omit<User, 'password'>): Promise<void>;
}
