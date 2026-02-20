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

    // Check if CPF already exists if provided
    if (data.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new BadRequestException("CPF already exists");
      }
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    const newUser = new User({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "VICTIM", // Enforce VICTIM role for self-registration or allow from DTO if needed
      cpf: data.cpf,
    } as Partial<User>);

    const createdUser = await this.userRepository.create(newUser);
    const { access_token } = this.authService.login(createdUser);

    return {
      user: createdUser,
      access_token,
    };
  }
}
