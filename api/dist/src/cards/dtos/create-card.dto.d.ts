export declare const CreateCartSchema: import("zod").ZodObject<{
    front: import("zod").ZodString;
    back: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
declare const CreateCartDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    front: import("zod").ZodString;
    back: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateCartDto extends CreateCartDto_base {
}
export {};
