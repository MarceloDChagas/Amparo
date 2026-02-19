import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

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
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  async register(@Body() registerDto: RegisterUserDto) {
    return this.registerUserUseCase.execute(registerDto);
  }
}
