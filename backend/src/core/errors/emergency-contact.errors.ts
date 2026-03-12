export class EmergencyContactLimitExceededError extends Error {
  constructor() {
    super("O limite máximo é de 3 contatos de confiança por usuária.");
    this.name = "EmergencyContactLimitExceededError";
  }
}
