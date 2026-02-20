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

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { Role } from "@/core/domain/enums/role.enum";
import { CreateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/create-emergency-contact.use-case";
import { DeleteEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/delete-emergency-contact.use-case";
import { GetEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/get-emergency-contact.use-case";
import { UpdateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/update-emergency-contact.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { EmergencyContactPresenter } from "@/infra/http/presenters/emergency-contact.presenter";
import { CreateEmergencyContactDto } from "@/infra/http/schemas/create-emergency-contact.schema";
import { UpdateEmergencyContactDto } from "@/infra/http/schemas/update-emergency-contact.schema";

@Controller("emergency-contacts")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class EmergencyContactController {
  constructor(
    private readonly createEmergencyContactUseCase: CreateEmergencyContactUseCase,
    private readonly getEmergencyContactUseCase: GetEmergencyContactUseCase,
    private readonly updateEmergencyContactUseCase: UpdateEmergencyContactUseCase,
    private readonly deleteEmergencyContactUseCase: DeleteEmergencyContactUseCase,
  ) {}

  @Post()
  @Roles(Role.VICTIM)
  @UsePipes(ZodValidationPipe)
  async create(@Body() createEmergencyContactDto: CreateEmergencyContactDto) {
    const contact = new EmergencyContact(
      createEmergencyContactDto as EmergencyContact,
    );
    const createdContact =
      await this.createEmergencyContactUseCase.execute(contact);
    return EmergencyContactPresenter.toHTTP(createdContact);
  }

  @Get()
  @Roles(Role.VICTIM)
  async findAll() {
    const contacts = await this.getEmergencyContactUseCase.executeFindAll();
    return contacts.map((contact) => EmergencyContactPresenter.toHTTP(contact));
  }

  @Get("user/:userId")
  @Roles(Role.VICTIM, Role.ADMIN)
  async findByUser(@Param("userId") userId: string) {
    const contacts =
      await this.getEmergencyContactUseCase.executeFindByUserId(userId);
    return contacts.map((contact) => EmergencyContactPresenter.toHTTP(contact));
  }

  @Get(":id")
  @Roles(Role.VICTIM)
  async findOne(@Param("id") id: string) {
    const contact = await this.getEmergencyContactUseCase.execute(id);
    if (!contact) return null;
    return EmergencyContactPresenter.toHTTP(contact);
  }

  @Put(":id")
  @Roles(Role.VICTIM)
  @UsePipes(ZodValidationPipe)
  async update(
    @Param("id") id: string,
    @Body() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    const updatedContact = await this.updateEmergencyContactUseCase.execute(
      id,
      updateEmergencyContactDto,
    );
    return EmergencyContactPresenter.toHTTP(updatedContact);
  }

  @Delete(":id")
  @Roles(Role.VICTIM)
  async remove(@Param("id") id: string): Promise<void> {
    return this.deleteEmergencyContactUseCase.execute(id);
  }
}
