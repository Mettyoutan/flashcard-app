"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CardSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    deckId: zod_1.default.uuid(),
    front: zod_1.default.string().trim().max(100).nonempty(),
    back: zod_1.default.string().trim().max(300).nonempty(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
//# sourceMappingURL=card.schema.js.map