/**
 * email.service.ts
 *
 * Purpose:
 * - Provides functionality for sending emails, specifically for password reset requests.
 *
 * Logic Overview:
 * - Integrates with `@nestjs-modules/mailer` to send templated emails.
 * - Constructs a password reset URL and sends it to the user's email address.
 * - Logs the email sending process and handles potential errors.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../users/entities/user.entity';

/**
 * Service responsible for sending various types of emails from the application.
 */
@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EmailService.name);
  }

  /**
   * Sends a password reset email to the specified user.
   * The email includes a link with a unique reset token.
   * @param {UserEntity} user - The user entity to whom the email should be sent.
   * @param {string} token - The password reset token to be included in the reset URL.
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(user: UserEntity, token: string) {
    // In a real app, the URL would come from config
    const resetUrl = `http://localhost:4200/reset-password?token=${token}`;

    this.logger.debug(`Sending password reset email to: ${user.email}`);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your Password Reset Request for TDS Bookmark Manager',
        template: './password-reset', // points to password-reset.hbs template
        context: {
          name: user.firstName,
          url: resetUrl,
        },
      });
      this.logger.info(`Password reset email sent successfully to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${user.email}`, error);
      // Depending on the policy, you might want to throw an error here
    }
  }
}
