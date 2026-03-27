export class ActiveCheckInAlreadyExistsError extends Error {
  constructor() {
    super("User already has an active check-in");
    this.name = "ActiveCheckInAlreadyExistsError";
  }
}

export class ActiveCheckInNotFoundError extends Error {
  constructor() {
    super("No active check-in found for this user");
    this.name = "ActiveCheckInNotFoundError";
  }
}

export class CheckInNotFoundError extends Error {
  constructor() {
    super("Check-in not found");
    this.name = "CheckInNotFoundError";
  }
}

/**
 * AM-161 — CheckInExpectedButNotArrivedError
 * Disparado pelo MonitorCheckInUseCase quando a usuária não confirmou chegada
 * dentro do windowMinutes após o horário esperado.
 */
export class CheckInExpectedButNotArrivedError extends Error {
  constructor(public readonly scheduleId: string) {
    super(
      `Usuária não confirmou chegada dentro do prazo tolerado (schedule: ${scheduleId})`,
    );
    this.name = "CheckInExpectedButNotArrivedError";
  }
}

export class CheckInScheduleNotFoundError extends Error {
  constructor() {
    super("Agendamento de check-in não encontrado");
    this.name = "CheckInScheduleNotFoundError";
  }
}
