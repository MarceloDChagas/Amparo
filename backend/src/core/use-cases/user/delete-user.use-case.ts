import { Inject, Injectable } from "@nestjs/common";

import type { UserRepository } from "@/core/domain/repositories/user.repository";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";

/**
 * RF15 — Anonimização / Exclusão de Conta (MEDIUM)
 * Implementa o "Direito ao Esquecimento" da LGPD: permite que a usuária
 * solicite a exclusão completa de seus dados e histórico na plataforma.
 *
 * NRF01 — Conformidade Legal (LGPD)
 * A exclusão deve cobrir todos os dados pessoais identificáveis.
 * Verificar se a implementação no repositório garante remoção em cascata
 * de entidades relacionadas (ocorrências, contatos, documentos).
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
