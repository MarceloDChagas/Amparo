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

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { Role } from "@/core/domain/enums/role.enum";
import { CreateAggressorUseCase } from "@/core/use-cases/aggressor/create-aggressor.use-case";
import { DeleteAggressorUseCase } from "@/core/use-cases/aggressor/delete-aggressor.use-case";
import { GetAggressorUseCase } from "@/core/use-cases/aggressor/get-aggressor.use-case";
import { UpdateAggressorUseCase } from "@/core/use-cases/aggressor/update-aggressor.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

import { CreateAggressorDto } from "../schemas/create-aggressor.schema";
import { UpdateAggressorDto } from "../schemas/update-aggressor.schema";

@Controller("aggressors")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AggressorController {
  constructor(
    private readonly createAggressorUseCase: CreateAggressorUseCase,
    private readonly getAggressorUseCase: GetAggressorUseCase,
    private readonly updateAggressorUseCase: UpdateAggressorUseCase,
    private readonly deleteAggressorUseCase: DeleteAggressorUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.VICTIM)
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() createAggressorDto: CreateAggressorDto,
  ): Promise<Aggressor> {
    const aggressor = new Aggressor(createAggressorDto as Aggressor);
    return this.createAggressorUseCase.execute(aggressor);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<Aggressor[]> {
    return this.getAggressorUseCase.executeFindAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  async findOne(@Param("id") id: string): Promise<Aggressor | null> {
    return this.getAggressorUseCase.execute(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateAggressorDto: UpdateAggressorDto,
  ): Promise<Aggressor> {
    return this.updateAggressorUseCase.execute(id, updateAggressorDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteAggressorUseCase.execute(id);
  }
}
