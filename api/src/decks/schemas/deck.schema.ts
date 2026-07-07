import z from 'zod';

export const DeckSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string().trim().nonempty().max(100),
  description: z.string().trim().max(50).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Deck = z.infer<typeof DeckSchema>;
