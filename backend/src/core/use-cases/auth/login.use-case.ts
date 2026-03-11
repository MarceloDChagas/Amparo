import { Inject, Injectable } from "@nestjs/common";

import { UserRepository } from "@/core/domain/repositories/user.repository";
import { InvalidCredentialsError } from "@/core/errors/auth.errors";
import {
  PASSWORD_HASHER_PORT,
  PasswordHasherPort,
  TOKEN_SERVICE_PORT,
  TokenServicePort,
} from "@/core/ports/auth.ports";
import { AuthTokenOutput, LoginInput } from "@/core/use-cases/auth/auth.types";

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_PORT)
    private passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_PORT)
    private tokenService: TokenServicePort,
  ) {}

  async execute(credentials: LoginInput): Promise<AuthTokenOutput> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await this.passwordHasher.compare(
      credentials.password,
      user.password!,
    );

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    const access_token = this.tokenService.sign({
      email: user.email,
      sub: user.id,
      role: user.role,
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
