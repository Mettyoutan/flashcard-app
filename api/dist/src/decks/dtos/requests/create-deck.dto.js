"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeckDto = exports.CreateDeckSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const deck_schema_1 = require("../../schemas/deck.schema");
exports.CreateDeckSchema = deck_schema_1.DeckSchema.pick({
    title: true,
    description: true,
});
class CreateDeckDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateDeckSchema) {
}
exports.CreateDeckDto = CreateDeckDto;
//# sourceMappingURL=create-deck.dto.js.map