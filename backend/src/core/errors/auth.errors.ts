export class UserAlreadyExistsError extends Error {
  constructor(field: "email" | "cpf") {
    super(`${field.toUpperCase()} already registered`);
    this.name = "UserAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}
