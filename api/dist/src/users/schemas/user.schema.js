"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.UserSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    username: zod_1.default.string().trim().nonempty().max(50),
    email: zod_1.default.email().trim().nonempty(),
    password: zod_1.default.string().trim().min(6).max(100),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
//# sourceMappingURL=user.schema.js.map