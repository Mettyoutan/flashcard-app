import { createZodDto } from 'nestjs-zod';
import { DeckSchema } from 'src/decks/schemas/deck.schema';

export const UpdateDeckSchema = DeckSchema.pick({
  title: true,
  description: true,
}).partial();

export class UpdateDeckDto extends createZodDto(UpdateDeckSchema) {}
