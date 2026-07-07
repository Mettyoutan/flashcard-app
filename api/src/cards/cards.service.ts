import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Card } from './schemas/card.schema';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CardsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string, deckId: string): Promise<Card[]> {
    // Cari cards dengan deckId dan userId
    return await this.db.card.findMany({
      where: { deck: { id: deckId, userId } },
    });
  }

  async findOne(userId: string, deckId: string, cardId: string) {
    // Find with:
    // - user id
    // - deck id
    // - card id
    const card: Card | null = await this.db.card.findUnique({
      where: { id: cardId, deck: { id: deckId, userId } },
    });

    if (!card) throw new NotFoundException('Card not found.');
    return card;
  }

  async create(
    userId: string,
    deckId: string,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const deck = await this.db.deck.findUnique({
      where: { id: deckId, userId },
    });

    if (!deck) throw new NotFoundException('Deck not found.');

    return await this.db.card.create({
      data: {
        deckId,
        ...createCardDto,
      },
    });
  }

  async update(
    userId: string,
    deckId: string,
    cardId: string,
    updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return await this.db.card
      .update({
        where: { id: cardId, deckId, deck: { userId } },
        data: {
          ...updateCardDto,
        },
      })
      .catch((e: unknown) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        ) {
          throw new NotFoundException('Card not found.');
        }
        throw e;
      });
  }

  async delete(userId: string, deckId: string, cardId: string): Promise<void> {
    await this.db.card
      .delete({
        where: { id: cardId, deckId, deck: { userId } },
      })
      .catch((e: unknown) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        ) {
          throw new NotFoundException('Card not found.');
        }
        throw e;
      });
  }
}
