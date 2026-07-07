"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_schema_1 = require("../../../users/schemas/user.schema");
exports.AuthResponseSchema = zod_1.default.object({
    access: zod_1.default.string().nonempty(),
    user: user_schema_1.UserSchema.omit({
        password: true,
    }),
});
//# sourceMappingURL=auth.response.dto.js.map