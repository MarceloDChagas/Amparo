import { Inject, Injectable, Logger } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import type { IHeatMapRepository } from "@/core/domain/repositories/heat-map-repository.interface";
import type { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";
import { SendEmergencyNotificationUseCase } from "@/core/use-cases/notification/send-emergency-notification.use-case";

/**
 * RF05 — Banco de Dados Unificado (HIGH)
 * Registra uma nova ocorrência no prontuário unificado da vítima.
 * Cada ocorrência é persistida de forma permanente (append-only).
 *
 * RN07 — Histórico Imutável de Ocorrências (Append-only)
 * Ocorrências nunca são deletadas — apenas criadas ou atualizadas de status.
 * Isso garante validade jurídica do histórico para anexar a inquéritos (RF16).
 *
 * RN05 — Duplo Envio de Alertas / RF12 — Comunicação Multicanal
 * Após persistir, dispara `sendNotifications` de forma assíncrona (fire-and-forget)
 * para não bloquear a resposta ao usuário, mas garantindo o envio aos contatos.
 */
@Injectable()
export class CreateOccurrenceUseCase {
  private readonly logger = new Logger(CreateOccurrenceUseCase.name);

  constructor(
    @Inject("IOccurrenceRepository")
    private readonly occurrenceRepository: IOccurrenceRepository,
    private readonly sendEmergencyNotificationUseCase: SendEmergencyNotificationUseCase,
    @Inject("IHeatMapRepository")
    private readonly heatMapRepository: IHeatMapRepository,
  ) {}

  async execute(occurrence: Occurrence): Promise<Occurrence> {
    const createdOccurrence =
      await this.occurrenceRepository.create(occurrence);

    // AM-152 — atualiza heat map de forma assíncrona ao criar nova ocorrência.
    this.heatMapRepository
      .upsertFromOccurrence(createdOccurrence)
      .catch((error: unknown) => {
        this.logger.error(
          `Falha ao atualizar heat map para ocorrência ${createdOccurrence.id}: ${String(error)}`,
        );
      });

    // RN05 — notificação assíncrona para não impactar latência da criação (NRF05).
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
        occurrence.userId,
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
