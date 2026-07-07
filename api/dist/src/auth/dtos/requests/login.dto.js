"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.LoginSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const user_schema_1 = require("../../../users/schemas/user.schema");
exports.LoginSchema = user_schema_1.UserSchema.pick({
    email: true,
    password: true,
});
class LoginDto extends (0, nestjs_zod_1.createZodDto)(exports.LoginSchema) {
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map