import { Inject, Injectable, Logger } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import type { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";
import { SendEmergencyNotificationUseCase } from "@/core/use-cases/notification/send-emergency-notification.use-case";

@Injectable()
export class CreateOccurrenceUseCase {
  private readonly logger = new Logger(CreateOccurrenceUseCase.name);

  constructor(
    @Inject("IOccurrenceRepository")
    private readonly occurrenceRepository: IOccurrenceRepository,
    private readonly sendEmergencyNotificationUseCase: SendEmergencyNotificationUseCase,
  ) {}

  async execute(occurrence: Occurrence): Promise<Occurrence> {
    const createdOccurrence =
      await this.occurrenceRepository.create(occurrence);

    this.sendNotifications(createdOccurrence).catch((error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send emergency notifications for occurrence ${createdOccurrence.id}: ${errorMessage}`,
        errorStack,
      );
    });

    return createdOccurrence;
  }

  private async sendNotifications(occurrence: Occurrence): Promise<void> {
    try {
      const result = await this.sendEmergencyNotificationUseCase.execute(
        occurrence.victimId,
        occurrence,
      );

      this.logger.log(
        `Emergency notifications sent for occurrence ${occurrence.id}: ${result.emailsSent} sent, ${result.emailsFailed} failed out of ${result.totalContacts} total contacts`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error in notification process: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
