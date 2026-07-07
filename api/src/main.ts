import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
