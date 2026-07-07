import { TokenService } from './token.service';
import { DatabaseService } from "../database/database.service";
import { SigninDto } from './dtos/requests/signin.dto';
import { LoginDto } from './dtos/requests/login.dto';
import { AuthResponseDto } from './dtos/responses/auth.response.dto';
export declare class AuthService {
    private readonly db;
    private readonly tokenService;
    constructor(db: DatabaseService, tokenService: TokenService);
    signin({ username, email, password, }: SigninDto): Promise<AuthResponseDto & {
        refresh: string;
    }>;
    login(loginDto: LoginDto): Promise<AuthResponseDto & {
        refresh: string;
    }>;
    refresh(refresh: string): Promise<{
        access: string;
        refresh: string;
    }>;
    logout(refresh: string): Promise<void>;
}
