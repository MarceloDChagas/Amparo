import { Inject, Injectable, Logger } from "@nestjs/common";
import { AlertEventType, EventSource } from "@prisma/client";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { NotificationLog } from "@/core/domain/entities/notification-log.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import type { INotificationLogRepository } from "@/core/domain/repositories/notification-log-repository.interface";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import type { IEmailService } from "@/core/domain/services/email-service.interface";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";
import { getEmergencyAlertTemplate } from "@/infra/services/email-templates/emergency-alert-template";

interface CreateEmergencyAlertRequest {
  latitude: number;
  longitude: number;
  address?: string;
  userId?: string;
}

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

@Injectable()
export class CreateEmergencyAlert {
  private readonly logger = new Logger(CreateEmergencyAlert.name);

  constructor(
    private emergencyAlertRepository: EmergencyAlertRepository,
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
    @Inject("UserRepository")
    private userRepository: UserRepository,
    @Inject("IEmailService")
    private emailService: IEmailService,
    @Inject("INotificationLogRepository")
    private notificationLogRepository: INotificationLogRepository,
    private recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async execute(request: CreateEmergencyAlertRequest): Promise<void> {
    const alert = EmergencyAlert.create({
      latitude: request.latitude,
      longitude: request.longitude,
      address: request.address,
      userId: request.userId,
    });

    await this.emergencyAlertRepository.create(alert);

    // Record CREATED event
    await this.recordAlertEvent.execute({
      alertId: alert.id,
      type: AlertEventType.CREATED,
      source: EventSource.USER,
      message: request.userId
        ? "Chamado originado pelo usuário"
        : "Chamado originado anonimamente",
      metadata: JSON.stringify({
        latitude: request.latitude,
        longitude: request.longitude,
        address: request.address,
      }),
    });

    this.logger.log(
      `Emergency Alert created: ${alert.id} at [${alert.latitude}, ${alert.longitude}]`,
    );

    const { userId } = request;
    if (userId) {
      await this.notifyEmergencyContacts(userId, alert);
    }
  }

  private async notifyEmergencyContacts(
    userId: string,
    alert: EmergencyAlert,
  ): Promise<void> {
    try {
      const contacts =
        await this.emergencyContactRepository.findByUserId(userId);

      if (contacts.length === 0) {
        this.logger.log(`No emergency contacts found for user ${userId}`);
        return;
      }

      const user = await this.userRepository.findById(userId);
      const userName = user ? user.name : "Alguém";

      const mapLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
      const subject = "ALERTA DE EMERGÊNCIA - AMPARO";

      const htmlBody = getEmergencyAlertTemplate({
        userName: userName,
        locationLink: mapLink,
        time: alert.createdAt.toLocaleString("pt-BR"),
        address: alert.address || undefined,
      });

      const contactsWithEmail = contacts.filter((c) => !!c.email);

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
        `Sent notifications to ${contactsWithEmail.length} contacts for user ${userId}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error notifying contacts: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(`Error notifying contacts: ${String(error)}`);
      }
    }
  }

  /**
   * Attempts to send an email with exponential backoff retry.
   * Logs each attempt to the NotificationLog table.
   */
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

      // All retries exhausted — log as FAILED
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
