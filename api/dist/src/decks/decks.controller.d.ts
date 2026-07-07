import { DecksService } from './decks.service';
import { User } from "../../generated/prisma/client";
import { CreateDeckDto } from './dtos/requests/create-deck.dto';
import { Deck } from './schemas/deck.schema';
import { UpdateDeckDto } from './dtos/requests/update-deck.dto';
export declare class DecksController {
    private readonly decksService;
    constructor(decksService: DecksService);
    findAll(user: Omit<User, 'password'>): Promise<Deck[]>;
    findById(id: string, user: Omit<User, 'password'>): Promise<Deck>;
    create(user: Omit<User, 'password'>, createDeckDto: CreateDeckDto): Promise<Deck>;
    update(id: string, user: Omit<User, 'password'>, updateDeckDto: UpdateDeckDto): Promise<void>;
}
