import { Module } from "@nestjs/common";

import { AggressorModule } from "@/infra/modules/aggressor.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [AggressorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
