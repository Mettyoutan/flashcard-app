export declare const UpdateDeckSchema: import("zod").ZodObject<{
    title: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>>;
}, import("zod/v4/core").$strip>;
declare const UpdateDeckDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    title: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateDeckDto extends UpdateDeckDto_base {
}
export {};
