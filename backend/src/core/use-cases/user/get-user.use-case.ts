import { Inject, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async executeFindAll(): Promise<User[]> {
    return this.userRepository.findByRole("VICTIM");
  }
}
