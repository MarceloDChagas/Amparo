import { Module } from "@nestjs/common";

import { StorageController } from "@/infra/http/controllers/storage.controller";
import { StorageService } from "@/infra/services/storage.service";

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
