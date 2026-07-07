"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPayloadSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.JwtPayloadSchema = zod_1.default.object({
    sub: zod_1.default.uuid().trim(),
    exp: zod_1.default.number(),
    iat: zod_1.default.number(),
});
//# sourceMappingURL=jwt-payload.schema.js.map