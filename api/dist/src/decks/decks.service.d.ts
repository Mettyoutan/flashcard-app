import { DatabaseService } from "../database/database.service";
import { Deck } from './schemas/deck.schema';
import { CreateDeckDto } from './dtos/requests/create-deck.dto';
import { UpdateDeckDto } from './dtos/requests/update-deck.dto';
export declare class DecksService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(userId: string): Promise<Deck[]>;
    findById(userId: string, deckId: string): Promise<Deck>;
    create(userId: string, createDeckDto: CreateDeckDto): Promise<Deck>;
    update(userId: string, deckId: string, updateDeckDto: UpdateDeckDto): Promise<Deck>;
    delete(userId: string, deckId: string): Promise<void>;
}
