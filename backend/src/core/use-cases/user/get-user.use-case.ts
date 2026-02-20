import { Inject, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async executeFindAll(): Promise<User[]> {
    return this.userRepository.findByRole("VICTIM");
  }
}
