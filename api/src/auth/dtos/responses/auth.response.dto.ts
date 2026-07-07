import z from 'zod';
import { UserSchema } from 'src/users/schemas/user.schema';

export const AuthResponseSchema = z.object({
  access: z.string().nonempty(),
  user: UserSchema.omit({
    password: true,
  }),
});

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
