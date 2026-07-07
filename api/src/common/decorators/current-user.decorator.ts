import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { User } from 'src/users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<User, 'password'> => {
    // Request.user tempat mengisi user yg terauthenticate
    const { user } = ctx.switchToHttp().getRequest<Request>();

    if (!user) {
      throw new UnauthorizedException('User Not Authenticated.');
    }

    return user;
  },
);
