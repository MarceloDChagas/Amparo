import { Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { LoginDto } from "@/infra/http/dtos/login.dto";
import { AuthService } from "@/infra/services/auth.service";

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(credentials: LoginDto) {
    const user = await this.userRepository.findByEmail(credentials.email);
    const validatedUser = await this.authService.validateUser(
      credentials.email,
      credentials.password,
      user,
    );

    if (!validatedUser) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authService.login(user as User);
  }
}
