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
exports.DecksService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("../../generated/prisma/client");
let DecksService = class DecksService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(userId) {
        return await this.db.deck.findMany({ where: { userId } });
    }
    async findById(userId, deckId) {
        const deck = await this.db.deck.findUnique({
            where: { id: deckId, userId },
        });
        if (!deck)
            throw new common_1.NotFoundException('Deck not found.');
        return deck;
    }
    async create(userId, createDeckDto) {
        return await this.db.deck.create({
            data: {
                userId,
                ...createDeckDto,
            },
        });
    }
    async update(userId, deckId, updateDeckDto) {
        return await this.db.deck
            .update({
            where: { userId, id: deckId },
            data: { ...updateDeckDto },
        })
            .catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2025') {
                throw new common_1.NotFoundException('Deck not found.');
            }
            throw e;
        });
    }
    async delete(userId, deckId) {
        await this.db.deck
            .delete({ where: { userId, id: deckId } })
            .catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2025') {
                throw new common_1.NotFoundException('Deck not found.');
            }
            throw e;
        });
    }
};
exports.DecksService = DecksService;
exports.DecksService = DecksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DecksService);
//# sourceMappingURL=decks.service.js.map