import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { DeleteUserUseCase } from "@/core/use-cases/user/delete-user.use-case";
import { GetUserUseCase } from "@/core/use-cases/user/get-user.use-case";
import { UpdateUserUseCase } from "@/core/use-cases/user/update-user.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { UserPresenter } from "@/infra/http/presenters/user.presenter";
import { CreateUserDto } from "@/infra/http/schemas/create-user.schema";
import { UpdateUserDto } from "@/infra/http/schemas/update-user.schema";

@Controller("users")
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    const { user } = await this.registerUserUseCase.execute({
      ...createUserDto,
    });
    const createdUser = await this.getUserUseCase.execute(user.id);
    if (!createdUser) return null;
    return UserPresenter.toHTTP(createdUser);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    const users = await this.getUserUseCase.executeFindAll();
    return users.map((user) => UserPresenter.toHTTP(user));
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findOne(@Param("id") id: string) {
    const user = await this.getUserUseCase.execute(id);
    if (!user) return null;
    return UserPresenter.toHTTP(user);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(ZodValidationPipe)
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.updateUserUseCase.execute(id, updateUserDto);
    return UserPresenter.toHTTP(updatedUser);
  }

  /**
   * RF15 — Anonimização / Exclusão de Conta (LGPD)
   * Permite que a própria usuária exclua todos os seus dados ("Direito ao Esquecimento").
   * A rota /me usa o ID extraído do token JWT para evitar que uma usuária exclua a conta de outra.
   */
  @Delete("me")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async removeSelf(@Request() req: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.deleteUserUseCase.execute(req.user.id as string);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
