import z from 'zod';
export declare const AuthResponseSchema: z.ZodObject<{
    access: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        email: z.ZodEmail;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
