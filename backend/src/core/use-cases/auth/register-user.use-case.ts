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

/**
 * RF10 — Autenticação e Autorização Segura (HIGH)
 * Registro de novo usuário com geração de JWT. Senhas são armazenadas
 * com hash via `PasswordHasherPort` (bcrypt na implementação atual).
 *
 * RF05 — Banco de Dados Unificado (HIGH)
 * Todo perfil criado aqui compõe o cadastro unificado de vítimas.
 *
 * RN08 — Unicidade de Cadastro via CPF
 * O CPF é a chave de identificação principal. O sistema rejeita cadastros
 * duplicados por e-mail ou CPF para manter integridade do prontuário.
 *
 * NRF01 — Conformidade Legal (LGPD)
 * Dados pessoais (CPF, senha) tratados com sigilo: senha hasheada,
 * CPF criptografado em repouso via `EncryptionService`.
 */
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

    // RN08 — rejeita CPF duplicado para evitar múltiplos perfis para a mesma vítima.
    if (data.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new UserAlreadyExistsError("cpf");
      }
    }

    // NRF01 / RF10 — senha nunca armazenada em texto claro.
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
