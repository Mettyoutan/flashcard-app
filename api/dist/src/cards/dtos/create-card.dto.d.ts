export declare const CreateCardSchema: import("zod").ZodObject<{
    front: import("zod").ZodString;
    back: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
declare const CreateCardDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    front: import("zod").ZodString;
    back: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateCardDto extends CreateCardDto_base {
}
export {};
