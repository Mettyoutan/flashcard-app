export declare const LoginSchema: import("zod").ZodObject<{
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
declare const LoginDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class LoginDto extends LoginDto_base {
}
export {};
