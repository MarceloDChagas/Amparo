import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";

import { CreateOccurrenceDto } from "../schemas/create-occurrence.schema";

@Controller("occurrences")
export class OccurrenceController {
  constructor(
    private readonly createOccurrenceUseCase: CreateOccurrenceUseCase,
    private readonly getOccurrenceUseCase: GetOccurrenceUseCase,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() createOccurrenceDto: CreateOccurrenceDto,
  ): Promise<Occurrence> {
    const occurrence = new Occurrence({
      ...createOccurrenceDto,
    } as Occurrence);
    return this.createOccurrenceUseCase.execute(occurrence);
  }

  @Get()
  async findAll(): Promise<Occurrence[]> {
    return this.getOccurrenceUseCase.execute();
  }
}
