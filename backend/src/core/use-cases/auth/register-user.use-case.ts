import { BadRequestException, Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { RegisterUserDto } from "@/infra/http/dtos/register-user.dto";
import { AuthService } from "@/infra/services/auth.service";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(data: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    // Assuming role is handled default in entity or passed if allowed (for now allow defaults)
    const newUser = new User({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "VICTIM", // Enforce VICTIM role for self-registration
    } as Partial<User>);

    const createdUser = await this.userRepository.create(newUser);
    return this.authService.login(createdUser);
  }
}
