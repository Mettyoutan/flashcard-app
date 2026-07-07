import { Strategy } from 'passport-jwt';
import { User } from "../../users/schemas/user.schema";
import { DatabaseService } from "../../database/database.service";
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly db;
    private readonly configService;
    constructor(db: DatabaseService, configService: ConfigService);
    validate(rawPayload: unknown): Promise<Omit<User, 'password'>>;
}
export {};
