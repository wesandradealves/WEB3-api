import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import HttpExceptionFilter from './domain/commons/interceptors/http.exception';
import { healthRoute } from './infrastructure/api-health/api-health.router';

const logger = new Logger('Application');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    logger: ['debug', 'debug', 'log', 'verbose', 'warn'],
  });

  app.use(healthRoute);
  app.useBodyParser('json', { limit: '10mb' });
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application started in port: ${process.env.PORT || 3000}`);
}
bootstrap();
