import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { Role } from "@/core/domain/enums/role.enum";
import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

import { CreateOccurrenceDto } from "../schemas/create-occurrence.schema";

@Controller("occurrences")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class OccurrenceController {
  constructor(
    private readonly createOccurrenceUseCase: CreateOccurrenceUseCase,
    private readonly getOccurrenceUseCase: GetOccurrenceUseCase,
  ) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
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
  @Roles(Role.ADMIN)
  async findAll(): Promise<Occurrence[]> {
    return this.getOccurrenceUseCase.execute();
  }
}
