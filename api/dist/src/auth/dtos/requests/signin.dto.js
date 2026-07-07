"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninDto = exports.SigninSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const user_schema_1 = require("../../../users/schemas/user.schema");
exports.SigninSchema = user_schema_1.UserSchema.pick({
    username: true,
    email: true,
    password: true,
});
class SigninDto extends (0, nestjs_zod_1.createZodDto)(exports.SigninSchema) {
}
exports.SigninDto = SigninDto;
//# sourceMappingURL=signin.dto.js.map