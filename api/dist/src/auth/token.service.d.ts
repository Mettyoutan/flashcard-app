import { JwtService } from '@nestjs/jwt';
export declare class TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateAccess(userId: string): Promise<string>;
    generateRefresh(userId: string): Promise<string>;
    verifyToken(token: string): Promise<{
        sub: string;
        exp: number;
        iat: number;
    }>;
}
