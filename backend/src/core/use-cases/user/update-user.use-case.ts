import { Inject, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
  ) {}

  async execute(id: string, user: Partial<User>): Promise<User> {
    return this.userRepository.update(id, user);
  }
}
