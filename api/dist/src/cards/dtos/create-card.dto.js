"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartDto = exports.CreateCartSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const card_schema_1 = require("../schemas/card.schema");
exports.CreateCartSchema = card_schema_1.CardSchema.pick({
    front: true,
    back: true,
});
class CreateCartDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateCartSchema) {
}
exports.CreateCartDto = CreateCartDto;
//# sourceMappingURL=create-card.dto.js.map