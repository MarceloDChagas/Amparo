import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

import { IEmailService } from "@/core/domain/services/email-service.interface";

@Injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmergencyNotification(
    to: string,
    subject: string,
    body: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html: body,
      });
      this.logger.log(`Emergency notification sent successfully to ${to}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send emergency notification to ${to}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
