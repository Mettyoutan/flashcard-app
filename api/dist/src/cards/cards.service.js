"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("../../generated/prisma/client");
let CardsService = class CardsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(userId, deckId) {
        return await this.db.card.findMany({
            where: { deck: { id: deckId, userId } },
        });
    }
    async findOne(userId, deckId, cardId) {
        const card = await this.db.card.findUnique({
            where: { id: cardId, deck: { id: deckId, userId } },
        });
        if (!card)
            throw new common_1.NotFoundException('Card not found.');
        return card;
    }
    async create(userId, deckId, createCardDto) {
        const deck = await this.db.deck.findUnique({
            where: { id: deckId, userId },
        });
        if (!deck)
            throw new common_1.NotFoundException('Deck not found.');
        return await this.db.card.create({
            data: {
                deckId,
                ...createCardDto,
            },
        });
    }
    async update(userId, deckId, cardId, updateCardDto) {
        return await this.db.card
            .update({
            where: { id: cardId, deckId, deck: { userId } },
            data: {
                ...updateCardDto,
            },
        })
            .catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2025') {
                throw new common_1.NotFoundException('Card not found.');
            }
            throw e;
        });
    }
    async delete(userId, deckId, cardId) {
        await this.db.card
            .delete({
            where: { id: cardId, deckId, deck: { userId } },
        })
            .catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2025') {
                throw new common_1.NotFoundException('Card not found.');
            }
            throw e;
        });
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CardsService);
//# sourceMappingURL=cards.service.js.map