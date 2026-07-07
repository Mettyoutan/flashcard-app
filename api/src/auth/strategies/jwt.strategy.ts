import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadSchema } from '../schemas/jwt-payload.schema';
import { User } from 'src/users/schemas/user.schema';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(rawPayload: unknown): Promise<Omit<User, 'password'>> {
    // Validate dengan schema
    const result = await JwtPayloadSchema.safeParseAsync(rawPayload);
    if (!result.success) {
      throw new UnauthorizedException('Payload not matches');
    }

    const user = await this.db.user.findUnique({
      where: { id: result.data.sub },
      omit: { password: true },
    });

    if (!user)
      throw new UnauthorizedException('Cannot found user with this token');

    return user;
  }
}
