import z from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  username: z.string().trim().nonempty().max(50),
  email: z.email().trim().nonempty(),
  password: z.string().trim().min(6).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
