"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardDto = exports.UpdateCardSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const card_schema_1 = require("../schemas/card.schema");
exports.UpdateCardSchema = card_schema_1.CardSchema.pick({
    front: true,
    back: true,
}).partial();
class UpdateCardDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateCardSchema) {
}
exports.UpdateCardDto = UpdateCardDto;
//# sourceMappingURL=update-card.dto.js.map