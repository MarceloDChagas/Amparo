import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AggressorModule } from "@/infra/modules/aggressor.module";
import { AuthModule } from "@/infra/modules/auth.module";
import { DatabaseModule } from "@/infra/modules/database.module";
import { EmailModule } from "@/infra/modules/email.module";
import { EmergencyAlertModule } from "@/infra/modules/emergency-alert.module";
import { EmergencyContactModule } from "@/infra/modules/emergency-contact.module";
import { OccurrenceModule } from "@/infra/modules/occurrence.module";
import { VictimModule } from "@/infra/modules/victim.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmailModule,
    AuthModule,
    AggressorModule,
    VictimModule,
    OccurrenceModule,
    EmergencyContactModule,
    EmergencyAlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
