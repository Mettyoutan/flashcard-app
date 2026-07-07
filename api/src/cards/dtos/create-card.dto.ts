import { createZodDto } from 'nestjs-zod';
import { CardSchema } from '../schemas/card.schema';

export const CreateCardSchema = CardSchema.pick({
  front: true,
  back: true,
});

export class CreateCardDto extends createZodDto(CreateCardSchema) {}
