import { Inject, Injectable, Logger } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import type { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";
import type { IEmailService } from "@/core/domain/services/email-service.interface";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { getEmergencyAlertTemplate } from "@/infra/services/email-templates/emergency-alert-template";

interface CreateEmergencyAlertRequest {
  latitude: number;
  longitude: number;
  address?: string;
  victimId?: string;
}

@Injectable()
export class CreateEmergencyAlert {
  private readonly logger = new Logger(CreateEmergencyAlert.name);

  constructor(
    private emergencyAlertRepository: EmergencyAlertRepository,
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
    @Inject("IVictimRepository")
    private victimRepository: IVictimRepository,
    @Inject("IEmailService")
    private emailService: IEmailService,
  ) {}

  async execute(request: CreateEmergencyAlertRequest): Promise<void> {
    const alert = EmergencyAlert.create({
      latitude: request.latitude,
      longitude: request.longitude,
      address: request.address,
      victimId: request.victimId,
    });

    await this.emergencyAlertRepository.create(alert);

    this.logger.log(
      `Emergency Alert created: ${alert.id} at [${alert.latitude}, ${alert.longitude}]`,
    );

    const { victimId } = request;
    if (victimId) {
      await this.notifyEmergencyContacts(victimId, alert);
    }
  }

  private async notifyEmergencyContacts(
    victimId: string,
    alert: EmergencyAlert,
  ): Promise<void> {
    try {
      const contacts =
        await this.emergencyContactRepository.findByVictimId(victimId);

      if (contacts.length === 0) {
        this.logger.log(`No emergency contacts found for victim ${victimId}`);
        return;
      }

      const victim = await this.victimRepository.findById(victimId);
      const victimName = victim ? victim.name : "Alguém";

      const mapLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
      const subject = "ALERTA DE EMERGÊNCIA - AMPARO";

      const htmlBody = getEmergencyAlertTemplate({
        victimName,
        locationLink: mapLink,
        time: alert.createdAt.toLocaleString("pt-BR"),
        address: alert.address || undefined,
      });

      const contactsWithEmail = contacts.filter((c) => !!c.email);

      // Parallel execution for faster response
      await Promise.all(
        contactsWithEmail.map((contact) =>
          this.emailService
            .sendEmergencyNotification(
              contact.email as string,
              subject,
              htmlBody,
            )
            .catch((err) => {
              const errorMessage =
                err instanceof Error ? err.stack : String(err);
              this.logger.error(
                `Failed to send email to ${contact.email}`,
                errorMessage,
              );
            }),
        ),
      );

      this.logger.log(
        `Sent notifications to ${contactsWithEmail.length} contacts for victim ${victimId}`,
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
}
