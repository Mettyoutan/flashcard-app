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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jwt_1 = require("@nestjs/jwt");
const jwt_constant_1 = require("./constants/jwt.constant");
const common_1 = require("@nestjs/common");
const jwt_payload_schema_1 = require("./schemas/jwt-payload.schema");
let TokenService = class TokenService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateAccess(userId) {
        const access = await this.jwtService.signAsync({}, {
            subject: userId,
            expiresIn: `${jwt_constant_1.ACCESS_EXPIRES_IN_MS}Ms`,
        });
        return access;
    }
    async generateRefresh(userId) {
        const refresh = await this.jwtService.signAsync({}, {
            subject: userId,
            expiresIn: `${jwt_constant_1.RERFRESH_EXPIRES_IN_MS}Ms`,
        });
        return refresh;
    }
    async verifyToken(token) {
        try {
            const raw = await this.jwtService.verifyAsync(token);
            return jwt_payload_schema_1.JwtPayloadSchema.parse(raw);
        }
        catch {
            throw new common_1.UnauthorizedException('Token is not valid.');
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenService);
//# sourceMappingURL=token.service.js.map