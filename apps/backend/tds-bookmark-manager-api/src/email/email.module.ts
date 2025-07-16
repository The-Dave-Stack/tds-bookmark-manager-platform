/**
 * email.module.ts
 *
 * Purpose:
 * - Defines the Email module for the API.
 *
 * Logic Overview:
 * - Configures `@nestjs-modules/mailer` asynchronously using `ConfigService` to load SMTP settings
 *   and template directory.
 * - Provides `EmailService` for sending emails and exports it for use in other modules.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';

/**
 * NestJS module for handling email sending functionalities.
 * This module sets up the mailer configuration and provides the `EmailService`.
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'assets/templates'), // path to your templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService], // Provides EmailService for dependency injection
  exports: [EmailService], // Exports EmailService to be available for other modules
})
export class EmailModule {}
