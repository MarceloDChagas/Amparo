import { Inject, Injectable, Logger } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import {
  EMERGENCY_ALERT_NOTIFICATION_PORT,
  EmergencyAlertNotificationPort,
} from "@/core/ports/emergency-alert-notification.ports";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

interface CreateEmergencyAlertRequest {
  latitude: number;
  longitude: number;
  address?: string;
  userId?: string;
}

/**
 * RF01 — Botão de Emergência (HIGH)
 * Criação do alerta de emergência com envio automático de geolocalização
 * para as forças de segurança e contatos de confiança.
 *
 * RN02 — Impossibilidade de Autocancelamento
 * O alerta é irreversível pelo lado da usuária: não há método de cancel
 * exposto a ela. O encerramento só pode ser feito pelo operador do Dashboard.
 *
 * RN05 — Duplo Envio de Alertas
 * Além de persistir o alerta, o use case aciona `emergencyAlertNotificationPort`
 * que despacha notificações para os Contatos de Confiança da vítima (RF12).
 *
 * NRF05 — Desempenho de Carga
 * Operação crítica: deve responder em menos de 200ms no servidor.
 */
@Injectable()
export class CreateEmergencyAlert {
  private readonly logger = new Logger(CreateEmergencyAlert.name);

  constructor(
    private emergencyAlertRepository: EmergencyAlertRepository,
    @Inject(EMERGENCY_ALERT_NOTIFICATION_PORT)
    private readonly emergencyAlertNotificationPort: EmergencyAlertNotificationPort,
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

    // RN07 — Histórico Imutável: cada mudança de estado gera um novo registro de evento,
    // nunca sobrescreve o anterior, garantindo trilha de auditoria com validade jurídica.
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

    // RN05 — Duplo Envio: notifica contatos de confiança via e-mail com localização (RF12).
    await this.emergencyAlertNotificationPort.notify(alert);
  }
}
