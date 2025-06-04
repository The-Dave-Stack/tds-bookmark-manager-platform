// main.ts - Application entry point for NestJS API
// This file bootstraps the NestJS application, sets up global middlewares, logging, validation, CORS, security headers, and Swagger documentation.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  // Create the NestJS application with buffered logs
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Use the NestJS logger
  app.useLogger(app.get(Logger));

  // Get environment (development/production)
  const env = configService.get<string>('app.env');

  // Configure Pino logger for HTTP requests
  const pinoLogger = new PinoLogger({
    pinoHttp: {
      level: env !== 'production' ? 'debug' : 'info',
      // Redact sensitive information from logs
      redact: {
        paths: ['req.headers.authorization', 'req.headers["x-api-key"]', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword'],
        censor: '[REDACTED]',
      },
      // Pretty log format for development, JSON for production
      transport:
        env !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname,req.remoteAddress,req.remotePort,res.headers', // Simplifies logs in development
              },
            }
          : undefined, // Default to JSON in production
      // Custom properties to add to each log
      customProps: () => ({
        context: 'Bootstrap', // Useful for filtering logs
      }),
      // Disable success log for /health endpoint (if you have a health check)
      // autoLogging: {
      //   ignore: (req) => req.originalUrl === '/health',
      // },
    },
  });

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
