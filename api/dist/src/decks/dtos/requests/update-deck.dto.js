"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeckDto = exports.UpdateDeckSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const deck_schema_1 = require("../../schemas/deck.schema");
exports.UpdateDeckSchema = deck_schema_1.DeckSchema.pick({
    title: true,
    description: true,
}).partial();
class UpdateDeckDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateDeckSchema) {
}
exports.UpdateDeckDto = UpdateDeckDto;
//# sourceMappingURL=update-deck.dto.js.map