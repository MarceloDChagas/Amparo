export class EmergencyAlertNotFoundError extends Error {
  constructor(alertId: string) {
    super(`Alerta de emergência de ID ${alertId} não encontrado.`);
    this.name = "EmergencyAlertNotFoundError";
  }
}

export class InvalidAlertStatusTransitionError extends Error {
  constructor(currentStatus: string, targetStatus: string) {
    super(`Transição de status inválida: ${currentStatus} → ${targetStatus}.`);
    this.name = "InvalidAlertStatusTransitionError";
  }
}

export class CancellationReasonRequiredError extends Error {
  constructor() {
    super("O motivo do cancelamento é obrigatório.");
    this.name = "CancellationReasonRequiredError";
  }
}
