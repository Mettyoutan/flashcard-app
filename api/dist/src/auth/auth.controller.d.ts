import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/responses/auth.response.dto';
import { SigninDto } from './dtos/requests/signin.dto';
import type { Response } from 'express';
import { LoginDto } from './dtos/requests/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(signinDto: SigninDto, res: Response): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, res: Response): Promise<{
        access: string;
        user: {
            id: string;
            username: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    refresh(oldRefresh: string, res: Response): Promise<Omit<AuthResponseDto, 'user'>>;
    logout(res: Response, refreshToken: string): Promise<void>;
    private saveRefreshToCookie;
}
