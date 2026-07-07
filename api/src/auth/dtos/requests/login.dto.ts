import { createZodDto } from 'nestjs-zod';
import { UserSchema } from 'src/users/schemas/user.schema';

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

// Signin Dto
export class LoginDto extends createZodDto(LoginSchema) {}
