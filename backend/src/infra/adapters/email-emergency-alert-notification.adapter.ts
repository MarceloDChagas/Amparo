import { Inject, Injectable, Logger } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { NotificationLog } from "@/core/domain/entities/notification-log.entity";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import type { INotificationLogRepository } from "@/core/domain/repositories/notification-log-repository.interface";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import type { IEmailService } from "@/core/domain/services/email-service.interface";
import { EmergencyAlertNotificationPort } from "@/core/ports/emergency-alert-notification.ports";
import {
  EMERGENCY_ALERT_TEMPLATE_RENDERER,
  EmergencyAlertTemplateRendererPort,
} from "@/core/ports/emergency-alert-template-renderer.ports";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

@Injectable()
export class EmailEmergencyAlertNotificationAdapter implements EmergencyAlertNotificationPort {
  private readonly logger = new Logger(
    EmailEmergencyAlertNotificationAdapter.name,
  );

  constructor(
    @Inject("IEmergencyContactRepository")
    private readonly emergencyContactRepository: IEmergencyContactRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject("IEmailService")
    private readonly emailService: IEmailService,
    @Inject(EMERGENCY_ALERT_TEMPLATE_RENDERER)
    private readonly emergencyAlertTemplateRenderer: EmergencyAlertTemplateRendererPort,
    @Inject("INotificationLogRepository")
    private readonly notificationLogRepository: INotificationLogRepository,
    private readonly recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async notify(alert: EmergencyAlert): Promise<void> {
    if (!alert.userId) {
      return;
    }

    try {
      const contacts = await this.emergencyContactRepository.findByUserId(
        alert.userId,
      );

      if (contacts.length === 0) {
        this.logger.log(`No emergency contacts found for user ${alert.userId}`);
        return;
      }

      const user = await this.userRepository.findById(alert.userId);
      const userName = user ? user.name : "Alguém";

      const mapLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
      const subject = "ALERTA DE EMERGÊNCIA - AMPARO";

      const htmlBody = this.emergencyAlertTemplateRenderer.renderEmergencyAlert(
        {
          userName,
          locationLink: mapLink,
          time: alert.createdAt.toLocaleString("pt-BR"),
          address: alert.address || undefined,
        },
      );

      const contactsWithEmail = contacts.filter((contact) => !!contact.email);

      await Promise.all(
        contactsWithEmail.map((contact) =>
          this.sendWithRetry(
            contact.email as string,
            contact.name,
            subject,
            htmlBody,
            alert.id,
          ),
        ),
      );

      this.logger.log(
        `Sent notifications to ${contactsWithEmail.length} contacts for user ${alert.userId}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error notifying contacts: ${error.message}`,
          error.stack,
        );
        return;
      }

      this.logger.error(`Error notifying contacts: ${String(error)}`);
    }
  }

  private async sendWithRetry(
    email: string,
    contactName: string,
    subject: string,
    htmlBody: string,
    alertId: string,
    attempt = 1,
  ): Promise<void> {
    try {
      await this.emailService.sendEmergencyNotification(
        email,
        subject,
        htmlBody,
      );

      await this.notificationLogRepository.create(
        new NotificationLog({
          alertId,
          contactEmail: email,
          contactName,
          channel: "EMAIL",
          status: "SENT",
          attempt,
        }),
      );

      await this.recordAlertEvent.execute({
        alertId,
        type: AlertEventType.NOTIFICATION_SENT,
        source: EventSource.SYSTEM,
        message: `Notificação enviada para ${contactName}`,
        metadata: JSON.stringify({
          email,
          contactName,
          channel: "EMAIL",
          attempt,
        }),
      });

      this.logger.log(`Email sent to ${email} (attempt ${attempt})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Failed to send email to ${email} (attempt ${attempt}): ${errorMessage}`,
      );

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        this.logger.log(
          `Retrying email to ${email} in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));

        return this.sendWithRetry(
          email,
          contactName,
          subject,
          htmlBody,
          alertId,
          attempt + 1,
        );
      }

      await this.notificationLogRepository.create(
        new NotificationLog({
          alertId,
          contactEmail: email,
          contactName,
          channel: "EMAIL",
          status: "FAILED",
          errorMessage,
          attempt,
        }),
      );
    }
  }
}
