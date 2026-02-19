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
import { AggressorPresenter } from "@/infra/http/presenters/aggressor.presenter";

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
  async create(@Body() createAggressorDto: CreateAggressorDto) {
    const aggressor = new Aggressor(createAggressorDto as Aggressor);
    const createdAggressor =
      await this.createAggressorUseCase.execute(aggressor);
    return AggressorPresenter.toHTTP(createdAggressor);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const aggressors = await this.getAggressorUseCase.executeFindAll();
    return aggressors.map((aggressor) => AggressorPresenter.toHTTP(aggressor));
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  async findOne(@Param("id") id: string) {
    const aggressor = await this.getAggressorUseCase.execute(id);
    if (!aggressor) return null;
    return AggressorPresenter.toHTTP(aggressor);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateAggressorDto: UpdateAggressorDto,
  ) {
    const updatedAggressor = await this.updateAggressorUseCase.execute(
      id,
      updateAggressorDto,
    );
    return AggressorPresenter.toHTTP(updatedAggressor);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteAggressorUseCase.execute(id);
  }
}
