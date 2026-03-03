import { Module } from "@nestjs/common";

import { StorageService } from "@/infra/services/storage.service";

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
