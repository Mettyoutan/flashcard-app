import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './schemas/card.schema';
import { UpdateCardDto } from './dtos/update-card.dto';

// Route untuk card dibuat nested dengan deck
@Controller('decks/:deckId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Card[]> {
    return await this.cardsService.findAll(user.id, deckId);
  }

  @UseGuards(JwtGuard)
  @Get(':cardId')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Card> {
    return await this.cardsService.findOne(user.id, deckId, cardId);
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return await this.cardsService.create(user.id, deckId, createCardDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':cardId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return await this.cardsService.update(
      user.id,
      deckId,
      cardId,
      updateCardDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('deckId', ParseUUIDPipe) deckId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<void> {
    return this.cardsService.delete(user.id, deckId, cardId);
  }
}
