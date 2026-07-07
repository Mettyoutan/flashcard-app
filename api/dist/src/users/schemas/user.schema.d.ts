import z from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type User = z.infer<typeof UserSchema>;
