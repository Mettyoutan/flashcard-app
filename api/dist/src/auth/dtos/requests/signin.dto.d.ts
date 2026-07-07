export declare const SigninSchema: import("zod").ZodObject<{
    username: import("zod").ZodString;
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
declare const SigninDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    username: import("zod").ZodString;
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class SigninDto extends SigninDto_base {
}
export {};
