import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { CreateAggressorUseCase } from "@/core/use-cases/aggressor/create-aggressor.use-case";
import { DeleteAggressorUseCase } from "@/core/use-cases/aggressor/delete-aggressor.use-case";
import { GetAggressorUseCase } from "@/core/use-cases/aggressor/get-aggressor.use-case";
import { UpdateAggressorUseCase } from "@/core/use-cases/aggressor/update-aggressor.use-case";

import { CreateAggressorDto } from "../schemas/create-aggressor.schema";
import { UpdateAggressorDto } from "../schemas/update-aggressor.schema";

@Controller("aggressors")
export class AggressorController {
  constructor(
    private readonly createAggressorUseCase: CreateAggressorUseCase,
    private readonly getAggressorUseCase: GetAggressorUseCase,
    private readonly updateAggressorUseCase: UpdateAggressorUseCase,
    private readonly deleteAggressorUseCase: DeleteAggressorUseCase,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() createAggressorDto: CreateAggressorDto,
  ): Promise<Aggressor> {
    const aggressor = new Aggressor(createAggressorDto as Aggressor);
    return this.createAggressorUseCase.execute(aggressor);
  }

  @Get()
  async findAll(): Promise<Aggressor[]> {
    return this.getAggressorUseCase.executeFindAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Aggressor | null> {
    return this.getAggressorUseCase.execute(id);
  }

  @Put(":id")
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateAggressorDto: UpdateAggressorDto,
  ): Promise<Aggressor> {
    return this.updateAggressorUseCase.execute(id, updateAggressorDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteAggressorUseCase.execute(id);
  }
}
