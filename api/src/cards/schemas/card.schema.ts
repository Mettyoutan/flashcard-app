import z from 'zod';

export const CardSchema = z.object({
  id: z.uuid(),
  deckId: z.uuid(),
  front: z.string().trim().max(100).nonempty(),
  back: z.string().trim().max(300).nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Card = z.infer<typeof CardSchema>;
