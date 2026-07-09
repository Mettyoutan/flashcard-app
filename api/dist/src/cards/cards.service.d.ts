import { DatabaseService } from "../database/database.service";
import { Card } from './schemas/card.schema';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
export declare class CardsService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(userId: string, deckId: string): Promise<Card[]>;
    findOne(userId: string, deckId: string, cardId: string): Promise<{
        id: string;
        deckId: string;
        front: string;
        back: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, deckId: string, createCardDto: CreateCardDto): Promise<Card>;
    update(userId: string, deckId: string, cardId: string, updateCardDto: UpdateCardDto): Promise<Card>;
    delete(userId: string, deckId: string, cardId: string): Promise<void>;
}
