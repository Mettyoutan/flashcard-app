import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

// Buat guard
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: TokenExpiredError | JsonWebTokenError | Error | string | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status?: number,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    return user;
  }
}
