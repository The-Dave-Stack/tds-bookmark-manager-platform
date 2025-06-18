import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EmailService.name);
  }

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