export class EmergencyAlertNotFoundError extends Error {
  constructor(alertId: string) {
    super(`Alerta de emergência de ID ${alertId} não encontrado.`);
    this.name = "EmergencyAlertNotFoundError";
  }
}
