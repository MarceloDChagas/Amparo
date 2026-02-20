import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
    return UserPresenter.toHTTP(user);
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
  @Roles(Role.ADMIN, Role.VICTIM)
  async findOne(@Param("id") id: string) {
    const user = await this.getUserUseCase.execute(id);
    if (!user) return null;
    return UserPresenter.toHTTP(user);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN, Role.VICTIM)
  @UsePipes(ZodValidationPipe)
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.updateUserUseCase.execute(id, updateUserDto);
    return UserPresenter.toHTTP(updatedUser);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
