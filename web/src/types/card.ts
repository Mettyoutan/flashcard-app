/*
 id: z.uuid(),
  deckId: z.uuid(),
  front: z.string().trim().max(100).nonempty(),
  back: z.string().trim().max(300).nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
*/
export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
}
