import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DecksModule } from './decks/decks.module';
import { CardsModule } from './cards/cards.module';
import z from 'zod';

const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        return ConfigSchema.parse(config);
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DecksModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
