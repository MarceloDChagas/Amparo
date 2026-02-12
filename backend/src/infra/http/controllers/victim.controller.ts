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

import { Victim } from "@/core/domain/entities/victim.entity";
import { CreateVictimUseCase } from "@/core/use-cases/victim/create-victim.use-case";
import { DeleteVictimUseCase } from "@/core/use-cases/victim/delete-victim.use-case";
import { GetVictimUseCase } from "@/core/use-cases/victim/get-victim.use-case";
import { UpdateVictimUseCase } from "@/core/use-cases/victim/update-victim.use-case";
import { CreateVictimDto } from "@/infra/http/schemas/create-victim.schema";
import { UpdateVictimDto } from "@/infra/http/schemas/update-victim.schema";

@Controller("victims")
export class VictimController {
  constructor(
    private readonly createVictimUseCase: CreateVictimUseCase,
    private readonly getVictimUseCase: GetVictimUseCase,
    private readonly updateVictimUseCase: UpdateVictimUseCase,
    private readonly deleteVictimUseCase: DeleteVictimUseCase,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() createVictimDto: CreateVictimDto): Promise<Victim> {
    const victim = new Victim({
      ...createVictimDto,
      createdAt: new Date(),
    } as Victim);
    return this.createVictimUseCase.execute(victim);
  }

  @Get()
  async findAll(): Promise<Victim[]> {
    return this.getVictimUseCase.executeFindAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Victim | null> {
    return this.getVictimUseCase.execute(id);
  }

  @Put(":id")
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateVictimDto: UpdateVictimDto,
  ): Promise<Victim> {
    return this.updateVictimUseCase.execute(id, updateVictimDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteVictimUseCase.execute(id);
  }
}
