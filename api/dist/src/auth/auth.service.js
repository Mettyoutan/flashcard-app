"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("./token.service");
const database_service_1 = require("../database/database.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_constant_1 = require("./constants/jwt.constant");
const client_1 = require("../../generated/prisma/client");
let AuthService = class AuthService {
    db;
    tokenService;
    constructor(db, tokenService) {
        this.db = db;
        this.tokenService = tokenService;
    }
    async signin({ username, email, password, }) {
        const user = await this.db.user.findUnique({
            where: { email },
        });
        if (user) {
            throw new common_1.ConflictException('User already exists.');
        }
        password = await bcrypt_1.default.hash(password, 10);
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
                .catch((e) => {
                if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    e.code === 'P2002') {
                    throw new common_1.ConflictException('User with this email already exists.');
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
                    expiresAt: new Date(Date.now() + jwt_constant_1.RERFRESH_EXPIRES_IN_MS),
                },
            });
            return {
                access,
                refresh,
                user: newUser,
            };
        });
    }
    async login(loginDto) {
        const existingUser = await this.db.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!existingUser)
            throw new common_1.NotFoundException('Wrong email or password.');
        if (!(await bcrypt_1.default.compare(loginDto.password, existingUser.password))) {
            throw new common_1.UnauthorizedException('Wrong email or password.');
        }
        const { password, ...userResponse } = existingUser;
        const [access, refresh] = await Promise.all([
            this.tokenService.generateAccess(existingUser.id),
            this.tokenService.generateRefresh(existingUser.id),
        ]);
        await this.db.refreshToken.create({
            data: {
                userId: userResponse.id,
                token: refresh,
                expiresAt: new Date(Date.now() + jwt_constant_1.RERFRESH_EXPIRES_IN_MS),
            },
        });
        return {
            access,
            refresh,
            user: userResponse,
        };
    }
    async refresh(refresh) {
        const payload = await this.tokenService.verifyToken(refresh);
        return this.db.$transaction(async (tx) => {
            const record = await tx.refreshToken.findUnique({
                where: { token: refresh },
            });
            if (!record || record.revoked || record.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Refresh token is invalid or expired.');
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
                    expiresAt: new Date(Date.now() + jwt_constant_1.RERFRESH_EXPIRES_IN_MS),
                },
            });
            return { access, refresh: newRefresh };
        });
    }
    async logout(refresh) {
        await this.tokenService.verifyToken(refresh);
        const record = await this.db.refreshToken.findUnique({
            where: { token: refresh },
        });
        if (!record || record.revoked) {
            throw new common_1.UnauthorizedException('Refresh token is invalid or already revoked.');
        }
        await this.db.refreshToken.update({
            where: { id: record.id },
            data: { revoked: true },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map