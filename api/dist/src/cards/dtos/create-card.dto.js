"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCardDto = exports.CreateCardSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const card_schema_1 = require("../schemas/card.schema");
exports.CreateCardSchema = card_schema_1.CardSchema.pick({
    front: true,
    back: true,
});
class CreateCardDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateCardSchema) {
}
exports.CreateCardDto = CreateCardDto;
//# sourceMappingURL=create-card.dto.js.map