import { Module } from "@nestjs/common";

import { CreateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/create-emergency-contact.use-case";
import { DeleteEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/delete-emergency-contact.use-case";
import { GetEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/get-emergency-contact.use-case";
import { UpdateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/update-emergency-contact.use-case";
import { PrismaService } from "@/infra/database/prisma.service";
import { PrismaEmergencyContactRepository } from "@/infra/database/repositories/prisma-emergency-contact.repository";
import { EmergencyContactController } from "@/infra/http/controllers/emergency-contact.controller";

@Module({
  controllers: [EmergencyContactController],
  providers: [
    PrismaService,
    CreateEmergencyContactUseCase,
    GetEmergencyContactUseCase,
    UpdateEmergencyContactUseCase,
    DeleteEmergencyContactUseCase,
    {
      provide: "IEmergencyContactRepository",
      useClass: PrismaEmergencyContactRepository,
    },
  ],
})
export class EmergencyContactModule {}
