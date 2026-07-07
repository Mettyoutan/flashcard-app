"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.DeckSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    userId: zod_1.default.uuid(),
    title: zod_1.default.string().trim().nonempty().max(100),
    description: zod_1.default.string().trim().max(50).nullish(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
//# sourceMappingURL=deck.schema.js.map