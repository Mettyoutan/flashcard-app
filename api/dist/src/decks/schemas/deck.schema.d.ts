import z from 'zod';
export declare const DeckSchema: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodUUID;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type Deck = z.infer<typeof DeckSchema>;
