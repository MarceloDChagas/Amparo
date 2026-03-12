import { Module } from "@nestjs/common";

import { STORAGE_PORT } from "@/core/ports/storage.ports";
import { StorageController } from "@/infra/http/controllers/storage.controller";
import { StorageService } from "@/infra/services/storage.service";

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: STORAGE_PORT,
      useExisting: StorageService,
    },
  ],
  exports: [StorageService, STORAGE_PORT],
})
export class StorageModule {}
