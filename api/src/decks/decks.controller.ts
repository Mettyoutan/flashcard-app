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
import { DecksService } from './decks.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'generated/prisma/client';
import { CreateDeckDto } from './dtos/requests/create-deck.dto';
import { Deck } from './schemas/deck.schema';
import { UpdateDeckDto } from './dtos/requests/update-deck.dto';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: Omit<User, 'password'>): Promise<Deck[]> {
    return await this.decksService.findAll(user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Deck> {
    return await this.decksService.findById(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() createDeckDto: CreateDeckDto,
  ): Promise<Deck> {
    return await this.decksService.create(user.id, createDeckDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() updateDeckDto: UpdateDeckDto,
  ): Promise<Deck> {
    return await this.decksService.update(user.id, id, updateDeckDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<void> {
    await this.decksService.delete(user.id, id);
  }
}
