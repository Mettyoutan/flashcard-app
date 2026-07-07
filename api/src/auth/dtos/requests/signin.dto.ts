import { createZodDto } from 'nestjs-zod';
import { UserSchema } from 'src/users/schemas/user.schema';

export const SigninSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});

// Signin Dto
export class SigninDto extends createZodDto(SigninSchema) {}
