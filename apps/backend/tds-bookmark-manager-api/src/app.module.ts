import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { configurations } from './config';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'docker',
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
              context: 'URL-SHORTENER-API', // Útil para filtrar logs
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
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
