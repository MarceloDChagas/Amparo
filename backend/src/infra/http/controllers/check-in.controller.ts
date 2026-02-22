import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";

import { CompleteCheckInUseCase } from "@/core/use-cases/complete-check-in.use-case";
import { StartCheckInUseCase } from "@/core/use-cases/start-check-in.use-case";
import { PrismaService } from "@/infra/database/prisma.service";
import { StartCheckInDto } from "@/infra/http/dtos/check-in.dto";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

@ApiTags("Check-in")
@Controller("check-ins")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class CheckInController {
  constructor(
    private readonly startCheckInUseCase: StartCheckInUseCase,
    private readonly completeCheckInUseCase: CompleteCheckInUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post("start")
  @ApiOperation({ summary: "Start a new check-in" })
  @UsePipes(ZodValidationPipe)
  async start(@Request() req, @Body() body: StartCheckInDto) {
    return this.startCheckInUseCase.execute({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: req.user.id,
      distanceType: body.distanceType,
    });
  }

  @Post("complete")
  @ApiOperation({ summary: "Complete an active check-in" })
  async complete(@Request() req) {
    return this.completeCheckInUseCase.execute({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: req.user.id,
    });
  }

  @Get("active")
  @ApiOperation({ summary: "Get current active check-in for the user" })
  async getActive(@Request() req) {
    const checkIn = await this.prisma.checkIn.findFirst({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        userId: req.user.id,
        status: "ACTIVE",
      },
    });

    return checkIn || null;
  }
}
