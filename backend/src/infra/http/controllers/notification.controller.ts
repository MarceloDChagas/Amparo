import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

import { Role } from "@/core/domain/enums/role.enum";
import { GetUserNotificationsUseCase } from "@/core/use-cases/notification/get-user-notifications.use-case";
import { SendNotificationUseCase } from "@/core/use-cases/notification/send-notification.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

const sendNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z
    .enum(["ALERT", "SUCCESS", "WARNING", "INFO", "MAINTENANCE"])
    .default("INFO"),
  targetId: z.string().uuid().optional().nullable(),
});

type SendNotificationDto = z.infer<typeof sendNotificationSchema>;

@Controller("notifications")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class NotificationController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
  ) {}

  /** POST /notifications — Admin only: send a notification */
  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(sendNotificationSchema))
  async send(@Body() dto: SendNotificationDto) {
    const notification = await this.sendNotificationUseCase.execute({
      title: dto.title,
      body: dto.body,
      category: dto.category,
      targetId: dto.targetId ?? null,
    });
    return notification;
  }

  /** GET /notifications/user/:userId — Victim or Admin: get notifications for user */
  @Get("user/:userId")
  @Roles(Role.ADMIN, Role.USER)
  async findForUser(@Param("userId") userId: string) {
    return this.getUserNotificationsUseCase.execute(userId);
  }

  /** GET /notifications/user/:userId/unread-count — unread count */
  @Get("user/:userId/unread-count")
  @Roles(Role.ADMIN, Role.USER)
  async countUnread(@Param("userId") userId: string) {
    const count = await this.getUserNotificationsUseCase.countUnread(userId);
    return { count };
  }

  /** PATCH /notifications/user/:userId/read-all — mark all read for user */
  @Patch("user/:userId/read-all")
  @Roles(Role.ADMIN, Role.USER)
  async markAllRead(@Param("userId") userId: string) {
    await this.getUserNotificationsUseCase.markAllRead(userId);
    return { success: true };
  }
}
