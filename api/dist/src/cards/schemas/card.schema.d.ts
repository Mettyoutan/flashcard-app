import z from 'zod';
export declare const CardSchema: z.ZodObject<{
    id: z.ZodUUID;
    deckId: z.ZodUUID;
    front: z.ZodString;
    back: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type Card = z.infer<typeof CardSchema>;
