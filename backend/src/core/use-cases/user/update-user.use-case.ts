import { Inject, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository,
  ) {}

  async execute(id: string, user: Partial<User>): Promise<User> {
    return this.userRepository.update(id, user);
  }
}
