import { Module } from "@nestjs/common";

import { AggressorModule } from "@/infra/modules/aggressor.module";
import { VictimModule } from "@/infra/modules/victim.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [AggressorModule, VictimModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
