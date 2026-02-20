import { Inject, Injectable } from "@nestjs/common";

import type { UserRepository } from "@/core/domain/repositories/user.repository";

@Injectable()
export class DeleteVictimUseCase {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
