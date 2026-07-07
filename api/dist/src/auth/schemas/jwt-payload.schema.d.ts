import z from 'zod';
export declare const JwtPayloadSchema: z.ZodObject<{
    sub: z.ZodUUID;
    exp: z.ZodNumber;
    iat: z.ZodNumber;
}, z.core.$strip>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
