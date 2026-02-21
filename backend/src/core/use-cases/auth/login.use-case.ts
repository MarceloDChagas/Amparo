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
    console.log("Login lookup for:", credentials.email);
    const user = await this.userRepository.findByEmail(credentials.email);
    console.log("UserRepository return:", user);
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
