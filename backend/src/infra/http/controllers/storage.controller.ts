import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

import { Role } from "@/core/domain/enums/role.enum";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { StorageService } from "@/infra/services/storage.service";

const uploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  userId: z.string().uuid(),
});

export class UploadUrlDto extends createZodDto(uploadUrlSchema) {}

@Controller("storage")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("upload-url")
  @Roles(Role.ADMIN, Role.VICTIM)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ZodValidationPipe)
  async getUploadUrl(@Body() body: UploadUrlDto) {
    const { fileName, userId } = body;
    const timestamp = Date.now();
    const key = `documents/${userId}/${timestamp}-${fileName}`;

    const url = await this.storageService.getPresignedUploadUrl(key);

    return { url, key };
  }

  @Get("download-url")
  @Roles(Role.ADMIN, Role.VICTIM)
  async getDownloadUrl(@Query("key") key: string) {
    const url = await this.storageService.getPresignedDownloadUrl(key);
    return { url };
  }
}
