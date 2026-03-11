import { Inject, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { UserAlreadyExistsError } from "@/core/errors/auth.errors";
import {
  PASSWORD_HASHER_PORT,
  PasswordHasherPort,
  TOKEN_SERVICE_PORT,
  TokenServicePort,
} from "@/core/ports/auth.ports";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";
import {
  AuthTokenOutput,
  RegisterUserInput,
} from "@/core/use-cases/auth/auth.types";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_PORT)
    private passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_PORT)
    private tokenService: TokenServicePort,
  ) {}

  async execute(data: RegisterUserInput): Promise<AuthTokenOutput> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UserAlreadyExistsError("email");
    }

    if (data.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new UserAlreadyExistsError("cpf");
      }
    }

    const hashedPassword = await this.passwordHasher.hash(data.password);

    const newUser = new User({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "VICTIM",
      cpf: data.cpf,
    } as Partial<User>);

    const createdUser = await this.userRepository.create(newUser);
    const access_token = this.tokenService.sign({
      email: createdUser.email,
      sub: createdUser.id,
      role: createdUser.role,
    });

    return {
      access_token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
    };
  }
}
