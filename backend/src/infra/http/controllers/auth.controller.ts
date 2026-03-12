import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "@/core/errors/auth.errors";
import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { LoginDto } from "@/infra/http/dtos/login.dto";
import { RegisterUserDto } from "@/infra/http/dtos/register-user.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute({
        email: dto.email,
        password: dto.password,
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  async register(@Body() dto: RegisterUserDto) {
    try {
      return await this.registerUserUseCase.execute({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        cpf: dto.cpf,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
