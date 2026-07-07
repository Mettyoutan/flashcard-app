import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Deck } from './schemas/deck.schema';
import { CreateDeckDto } from './dtos/requests/create-deck.dto';
import { UpdateDeckDto } from './dtos/requests/update-deck.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class DecksService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string): Promise<Deck[]> {
    return await this.db.deck.findMany({ where: { userId } });
  }

  async findById(userId: string, deckId: string): Promise<Deck> {
    const deck: Deck | null = await this.db.deck.findUnique({
      where: { id: deckId, userId },
    });

    if (!deck) throw new NotFoundException('Deck not found.');

    return deck;
  }

  async create(userId: string, createDeckDto: CreateDeckDto): Promise<Deck> {
    return await this.db.deck.create({
      data: {
        userId,
        ...createDeckDto,
      },
    });
  }

  async update(
    userId: string,
    deckId: string,
    updateDeckDto: UpdateDeckDto,
  ): Promise<Deck> {
    return await this.db.deck
      .update({
        where: { userId, id: deckId },
        data: { ...updateDeckDto },
      })
      .catch((e: unknown) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        ) {
          throw new NotFoundException('Deck not found.');
        }
        throw e;
      });
  }

  async delete(userId: string, deckId: string): Promise<void> {
    await this.db.deck
      .delete({ where: { userId, id: deckId } })
      .catch((e: unknown) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        ) {
          throw new NotFoundException('Deck not found.');
        }
        throw e;
      });
  }
}
