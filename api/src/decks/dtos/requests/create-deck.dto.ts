import { createZodDto } from 'nestjs-zod';
import { DeckSchema } from 'src/decks/schemas/deck.schema';

export const CreateDeckSchema = DeckSchema.pick({
  title: true,
  description: true,
});

export class CreateDeckDto extends createZodDto(CreateDeckSchema) {}
