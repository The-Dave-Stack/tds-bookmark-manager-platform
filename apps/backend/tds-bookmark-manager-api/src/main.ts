// main.ts - Application entry point for NestJS API
// This file bootstraps the NestJS application, sets up global middlewares, logging, validation, CORS, security headers, and Swagger documentation.

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, PinoLogger } from 'nestjs-pino';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getPinoLoggerOptions } from './logger/config';
import helmet from 'helmet';

async function bootstrap() {
  // Log all environment variables before starting the application
  // Only log in non-production environments for security
  if (process.env.NODE_ENV !== 'production') {
    console.log('Loaded environment variables:', process.env);
  }

  // Create the NestJS application with buffered logs
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Use the NestJS logger
  app.useLogger(app.get(Logger));

  // Get environment (development/production)
  const env = configService.get<string>('app.env');

  // Configure Pino logger for HTTP requests
  const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env, context: 'Bootstrap' }));

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Enable CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: true, // Allow all origins for now, refine in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use Helmet for security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:'],
          connectSrc: [`'self'`],
        },
      },
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable API versioning via URI (e.g., /v1/)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configure global ValidationPipe for DTOs (with implicit type conversion)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payload to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
    }),
  );

  // Swagger (OpenAPI) configuration for API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name', 'API Documentation'))
    .setDescription('TDS Bookmark Manager API documentation.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    // Swagger UI options
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization in Swagger UI between reloads
    },
    customSiteTitle: `${configService.get<string>('app.name')} - API Docs`,
  });

  // Get port from config, default to 3000
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);

  // Log application URLs and environment
  pinoLogger.info(`🚀 Application running at: ${await app.getUrl()}`);
  pinoLogger.info(`📚 Swagger UI available at: ${await app.getUrl()}/api-docs`);
  pinoLogger.info(`🌱 Current environment: ${configService.get<string>('app.env')}`);
}

void bootstrap();
