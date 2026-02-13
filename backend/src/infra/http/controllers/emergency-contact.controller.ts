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

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { CreateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/create-emergency-contact.use-case";
import { DeleteEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/delete-emergency-contact.use-case";
import { GetEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/get-emergency-contact.use-case";
import { UpdateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/update-emergency-contact.use-case";
import { CreateEmergencyContactDto } from "@/infra/http/schemas/create-emergency-contact.schema";
import { UpdateEmergencyContactDto } from "@/infra/http/schemas/update-emergency-contact.schema";

@Controller("emergency-contacts")
export class EmergencyContactController {
  constructor(
    private readonly createEmergencyContactUseCase: CreateEmergencyContactUseCase,
    private readonly getEmergencyContactUseCase: GetEmergencyContactUseCase,
    private readonly updateEmergencyContactUseCase: UpdateEmergencyContactUseCase,
    private readonly deleteEmergencyContactUseCase: DeleteEmergencyContactUseCase,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    const contact = new EmergencyContact({
      ...createEmergencyContactDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as EmergencyContact);
    return this.createEmergencyContactUseCase.execute(contact);
  }

  @Get()
  async findAll(): Promise<EmergencyContact[]> {
    return this.getEmergencyContactUseCase.executeFindAll();
  }

  @Get("victim/:victimId")
  async findByVictim(
    @Param("victimId") victimId: string,
  ): Promise<EmergencyContact[]> {
    return this.getEmergencyContactUseCase.executeFindByVictimId(victimId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<EmergencyContact | null> {
    return this.getEmergencyContactUseCase.execute(id);
  }

  @Put(":id")
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    return this.updateEmergencyContactUseCase.execute(
      id,
      updateEmergencyContactDto,
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteEmergencyContactUseCase.execute(id);
  }
}
