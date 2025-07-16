/**
 * app.module.ts
 *
 * Purpose:
 * - Defines the root module of the TDS Bookmark Manager API.
 *
 * Logic Overview:
 * - Imports and configures all major modules, including configuration, database, logging,
 *   rate limiting, authentication, and feature modules.
 * - Sets up global guards (ThrottlerGuard, CsrfGuard) and middleware (ApiRedirectMiddleware).
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { ApiRedirectMiddleware } from './common/middlewares/redirect.middleware';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CsrfGuard } from './auth/guards/csrf.guard';
import { EmailModule } from './email/email.module';
import { FoldersModule } from './folders/folders.module';
import { LoggerModule } from 'nestjs-pino';
import { StatisticsModule } from './statistics/statistics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WebhookModule } from './webhook/webhook.module';
import { configurations } from './config';
import databaseConfig from './config/database.config';
import { randomBytes } from 'crypto';
import { validationSchema } from './config/validation.schema';

/**
 * The root module of the TDS Bookmark Manager API.
 * This module orchestrates the application's structure by importing and configuring
 * all necessary feature modules, global configurations, and cross-cutting concerns.
 */
@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'docker' || process.env.NODE_ENV === 'production',
      validationSchema: validationSchema,
      validationOptions: { abortEarly: true },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (config: ConfigType<typeof databaseConfig>) => {
        if (!config) {
          throw new Error('Database configuration not found');
        }
        return {
          ...config,
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      inject: [databaseConfig.KEY],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('app.env');
        return {
          pinoHttp: {
            level: env !== 'production' ? 'debug' : 'info',
            // Redacta información sensible de los logs
            redact: {
              paths: ['req.headers.authorization', 'req.headers["x-api-key"]', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword'],
              censor: '[REDACTED]',
            },
            // Formato de log bonito para desarrollo, JSON para producción
            transport:
              env !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname,req.remoteAddress,req.remotePort,res.headers', // Simplifica el log en desarrollo
                    },
                  }
                : undefined, // JSON en producción por defecto
            // Añade un ID de petición a cada log para facilitar el seguimiento
            genReqId: function (req, res) {
              const existingId = req.id ?? req.headers['x-request-id'];
              if (existingId) return existingId;
              // crypto es un módulo built-in de Node.js
              const id = randomBytes(8).toString('hex');
              res.setHeader('X-Request-Id', id);
              return id;
            },
            // Propiedades personalizadas para añadir a cada log
            customProps: () => ({
              context: 'TDS-BOOKMARK-MANAGER', // Útil para filtrar logs
            }),
            // Desactiva el log de éxito de /health (si tienes un health check)
            // autoLogging: {
            //   ignore: (req) => req.originalUrl === '/health',
            // },
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('app.globalRateLimitTtl', 60000),
          limit: configService.get<number>('app.globalRateLimitLimit', 100),
        },
      ],
    }),
    AuthModule,
    UsersModule,
    BookmarksModule,
    FoldersModule,
    AdminModule,
    StatisticsModule,
    WebhookModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configures middleware for the application.
   * Applies the `ApiRedirectMiddleware` to all routes.
   * @param {MiddlewareConsumer} consumer The middleware consumer.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRedirectMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
