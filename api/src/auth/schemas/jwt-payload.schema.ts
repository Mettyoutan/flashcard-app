import z from 'zod';

export const JwtPayloadSchema = z.object({
  sub: z.uuid().trim(),
  exp: z.number(),
  iat: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
