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
