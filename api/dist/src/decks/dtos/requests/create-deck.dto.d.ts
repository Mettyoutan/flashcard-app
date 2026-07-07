export declare const CreateDeckSchema: import("zod").ZodObject<{
    title: import("zod").ZodString;
    description: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>;
declare const CreateDeckDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    title: import("zod").ZodString;
    description: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateDeckDto extends CreateDeckDto_base {
}
export {};
