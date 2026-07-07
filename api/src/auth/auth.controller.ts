import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/responses/auth.response.dto';
import { SigninDto } from './dtos/requests/signin.dto';
import type { Response } from 'express';
import { RERFRESH_EXPIRES_IN_MS } from './constants/jwt.constant';
import { LoginDto } from './dtos/requests/login.dto';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { refresh, ...response } = await this.authService.signin(signinDto);

    this.saveRefreshToCookie(res, refresh);

    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, ...response } = await this.authService.login(loginDto);

    this.saveRefreshToCookie(res, refresh);

    return response;
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') oldRefresh: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'user'>> {
    const { access, refresh } = await this.authService.refresh(oldRefresh);

    this.saveRefreshToCookie(res, refresh);

    return {
      access,
    };
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refresh_token') refreshToken: string,
  ): Promise<void> {
    await this.authService.logout(refreshToken);

    // Remove refresh from cookie
    res.cookie('refresh_token', null, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/auth',
    });
  }

  private saveRefreshToCookie(res: Response, refresh: string): void {
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: RERFRESH_EXPIRES_IN_MS,
      path: '/auth',
    });
  }
}
