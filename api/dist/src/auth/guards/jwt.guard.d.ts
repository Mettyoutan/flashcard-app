import { ExecutionContext } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    handleRequest<TUser = any>(err: Error | null, user: TUser | false, info: TokenExpiredError | JsonWebTokenError | Error | string | null, context: ExecutionContext, status?: number): TUser;
}
export {};
