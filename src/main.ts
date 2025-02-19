// filepath: /home/victor/dourado/dourado-dashboard-backend/src/main.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import { healthRoute } from './infrastructure/api-health/api-health.router';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Application');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    logger: ['debug', 'debug', 'log', 'verbose', 'warn'],
  });

  app.use(healthRoute);
  app.useBodyParser('json', { limit: '10mb' });
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Dourado Dashboard API')
    .setDescription('API documentation for Dourado Dashboard')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application started in port: ${process.env.PORT || 3000}`);
}
bootstrap();