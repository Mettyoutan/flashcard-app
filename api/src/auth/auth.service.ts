import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { DatabaseService } from 'src/database/database.service';
import { SigninDto } from './dtos/requests/signin.dto';
import { LoginDto } from './dtos/requests/login.dto';
import { AuthResponseDto } from './dtos/responses/auth.response.dto';
import bcrypt from 'bcrypt';
import { RERFRESH_EXPIRES_IN_MS } from './constants/jwt.constant';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async signin({
    username,
    email,
    password,
  }: SigninDto): Promise<AuthResponseDto & { refresh: string }> {
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictException('User already exists.');
    }

    password = await bcrypt.hash(password, 10);

    return await this.db.$transaction(async (tx) => {
      const newUser = await tx.user
        .create({
          data: {
            username,
            email,
            password,
          },
          omit: { password: true },
        })
        .catch((e: unknown) => {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === 'P2002'
          ) {
            throw new ConflictException('User with this email already exists.');
          }
          throw e;
        });

      const [access, refresh] = await Promise.all([
        this.tokenService.generateAccess(newUser.id),
        this.tokenService.generateRefresh(newUser.id),
      ]);

      await tx.refreshToken.create({
        data: {
          userId: newUser.id,
          token: refresh,
          expiresAt: new Date(Date.now() + RERFRESH_EXPIRES_IN_MS),
        },
      });

      return {
        access,
        refresh,
        user: newUser,
      };
    });
  }

  async login(
    loginDto: LoginDto,
  ): Promise<AuthResponseDto & { refresh: string }> {
    const existingUser = await this.db.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!existingUser) throw new NotFoundException('Wrong email or password.');

    if (!(await bcrypt.compare(loginDto.password, existingUser.password))) {
      throw new UnauthorizedException('Wrong email or password.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = existingUser;

    // Generate jwt access & refresh token
    const [access, refresh] = await Promise.all([
      this.tokenService.generateAccess(existingUser.id),
      this.tokenService.generateRefresh(existingUser.id),
    ]);

    await this.db.refreshToken.create({
      data: {
        userId: userResponse.id,
        token: refresh,
        expiresAt: new Date(Date.now() + RERFRESH_EXPIRES_IN_MS),
      },
    });

    return {
      access,
      refresh,
      user: userResponse,
    };
  }

  async refresh(refresh: string) {
    const payload = await this.tokenService.verifyToken(refresh);

    return this.db.$transaction(async (tx) => {
      const record = await tx.refreshToken.findUnique({
        where: { token: refresh },
      });

      if (!record || record.revoked || record.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token is invalid or expired.');
      }

      await tx.refreshToken.update({
        where: { id: record.id },
        data: { revoked: true },
      });

      const [access, newRefresh] = await Promise.all([
        this.tokenService.generateAccess(payload.sub),
        this.tokenService.generateRefresh(payload.sub),
      ]);

      await tx.refreshToken.create({
        data: {
          userId: payload.sub,
          token: newRefresh,
          expiresAt: new Date(Date.now() + RERFRESH_EXPIRES_IN_MS),
        },
      });

      return { access, refresh: newRefresh };
    });
  }

  async logout(refresh: string) {
    await this.tokenService.verifyToken(refresh);

    const record = await this.db.refreshToken.findUnique({
      where: { token: refresh },
    });

    if (!record || record.revoked) {
      throw new UnauthorizedException(
        'Refresh token is invalid or already revoked.',
      );
    }

    await this.db.refreshToken.update({
      where: { id: record.id },
      data: { revoked: true },
    });
  }
}
