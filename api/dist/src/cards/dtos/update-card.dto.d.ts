export declare const UpdateCardSchema: import("zod").ZodObject<{
    front: import("zod").ZodOptional<import("zod").ZodString>;
    back: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>;
declare const UpdateCardDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    front: import("zod").ZodOptional<import("zod").ZodString>;
    back: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateCardDto extends UpdateCardDto_base {
}
export {};
