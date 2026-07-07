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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signin_dto_1 = require("./dtos/requests/signin.dto");
const jwt_constant_1 = require("./constants/jwt.constant");
const login_dto_1 = require("./dtos/requests/login.dto");
const cookie_decorator_1 = require("../common/decorators/cookie.decorator");
const jwt_guard_1 = require("./guards/jwt.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signin(signinDto, res) {
        const { refresh, ...response } = await this.authService.signin(signinDto);
        this.saveRefreshToCookie(res, refresh);
        return response;
    }
    async login(loginDto, res) {
        const { refresh, ...response } = await this.authService.login(loginDto);
        this.saveRefreshToCookie(res, refresh);
        return response;
    }
    async refresh(oldRefresh, res) {
        const { access, refresh } = await this.authService.refresh(oldRefresh);
        this.saveRefreshToCookie(res, refresh);
        return {
            access,
        };
    }
    async logout(res, refreshToken) {
        await this.authService.logout(refreshToken);
        res.cookie('refresh_token', null, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 0,
            path: '/auth',
        });
    }
    saveRefreshToCookie(res, refresh) {
        res.cookie('refresh_token', refresh, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: jwt_constant_1.RERFRESH_EXPIRES_IN_MS,
            path: '/auth',
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SigninDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('refresh'),
    __param(0, (0, cookie_decorator_1.Cookies)('refresh_token')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, cookie_decorator_1.Cookies)('refresh_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map