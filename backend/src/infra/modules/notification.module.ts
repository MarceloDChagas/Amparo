import { Module } from "@nestjs/common";

import { GetUserNotificationsUseCase } from "@/core/use-cases/notification/get-user-notifications.use-case";
import { SendNotificationUseCase } from "@/core/use-cases/notification/send-notification.use-case";
import { PrismaNotificationRepository } from "@/infra/database/repositories/prisma-notification.repository";
import { NotificationController } from "@/infra/http/controllers/notification.controller";

import { DatabaseModule } from "./database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [
    PrismaNotificationRepository,
    {
      provide: "INotificationRepository",
      useClass: PrismaNotificationRepository,
    },
    SendNotificationUseCase,
    GetUserNotificationsUseCase,
  ],
  exports: ["INotificationRepository"],
})
export class NotificationModule {}
