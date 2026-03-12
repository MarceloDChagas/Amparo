export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}

export const PASSWORD_HASHER_PORT = Symbol("PasswordHasherPort");

export interface TokenServicePort {
  sign(payload: { email: string; sub: string; role: string }): string;
}

export const TOKEN_SERVICE_PORT = Symbol("TokenServicePort");
