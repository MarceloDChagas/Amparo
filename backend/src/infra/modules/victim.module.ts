import { Module } from "@nestjs/common";

import { DeleteVictimUseCase } from "@/core/use-cases/victim/delete-victim.use-case";
import { GetVictimUseCase } from "@/core/use-cases/victim/get-victim.use-case";
import { UpdateVictimUseCase } from "@/core/use-cases/victim/update-victim.use-case";
import { VictimController } from "@/infra/http/controllers/victim.controller";
import { AuthModule } from "@/infra/modules/auth.module";
import { DatabaseModule } from "@/infra/modules/database.module";
import { EncryptionModule } from "@/infra/modules/encryption.module";

@Module({
  imports: [EncryptionModule, AuthModule, DatabaseModule],
  controllers: [VictimController],
  providers: [GetVictimUseCase, UpdateVictimUseCase, DeleteVictimUseCase],
})
export class VictimModule {}
