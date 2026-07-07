import { createZodDto } from 'nestjs-zod';
import { CardSchema } from '../schemas/card.schema';

export const UpdateCardSchema = CardSchema.pick({
  front: true,
  back: true,
}).partial();

export class UpdateCardDto extends createZodDto(UpdateCardSchema) {}
