import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_EXPIRES_IN_MS,
  RERFRESH_EXPIRES_IN_MS,
} from './constants/jwt.constant';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadSchema } from './schemas/jwt-payload.schema';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccess(userId: string) {
    const access = await this.jwtService.signAsync(
      {},
      {
        subject: userId,
        expiresIn: `${ACCESS_EXPIRES_IN_MS}Ms`,
      },
    );
    return access;
  }

  async generateRefresh(userId: string) {
    const refresh = await this.jwtService.signAsync(
      {},
      {
        subject: userId,
        expiresIn: `${RERFRESH_EXPIRES_IN_MS}Ms`,
      },
    );
    return refresh;
  }

  async verifyToken(token: string) {
    try {
      const raw: unknown = await this.jwtService.verifyAsync(token);
      return JwtPayloadSchema.parse(raw);
    } catch {
      throw new UnauthorizedException('Token is not valid.');
    }
  }
}
