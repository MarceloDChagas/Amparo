import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import {
  ActiveCheckInAlreadyExistsError,
  ActiveCheckInNotFoundError,
  CheckInNotFoundError,
} from "@/core/errors/check-in.errors";
import { CloseCheckInUseCase } from "@/core/use-cases/close-check-in.use-case";
import { CompleteCheckInUseCase } from "@/core/use-cases/complete-check-in.use-case";
import { EscalateCheckInUseCase } from "@/core/use-cases/escalate-check-in.use-case";
import { GetActiveCheckInUseCase } from "@/core/use-cases/get-active-check-in.use-case";
import { GetAllActiveCheckInsUseCase } from "@/core/use-cases/get-all-active-check-ins.use-case";
import { GetCheckInByIdUseCase } from "@/core/use-cases/get-check-in-by-id.use-case";
import { GetLateCheckInsUseCase } from "@/core/use-cases/get-late-check-ins.use-case";
import { StartCheckInUseCase } from "@/core/use-cases/start-check-in.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import {
  CompleteCheckInDto,
  StartCheckInDto,
} from "@/infra/http/dtos/check-in.dto";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

@ApiTags("Check-in")
@Controller("check-ins")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class CheckInController {
  constructor(
    private readonly startCheckInUseCase: StartCheckInUseCase,
    private readonly completeCheckInUseCase: CompleteCheckInUseCase,
    private readonly getActiveCheckInUseCase: GetActiveCheckInUseCase,
    private readonly getAllActiveCheckInsUseCase: GetAllActiveCheckInsUseCase,
    private readonly getCheckInByIdUseCase: GetCheckInByIdUseCase,
    private readonly getLateCheckInsUseCase: GetLateCheckInsUseCase,
    private readonly closeCheckInUseCase: CloseCheckInUseCase,
    private readonly escalateCheckInUseCase: EscalateCheckInUseCase,
  ) {}

  @Post("start")
  @ApiOperation({ summary: "Start a new check-in" })
  @UsePipes(ZodValidationPipe)
  async start(@Request() req, @Body() body: StartCheckInDto) {
    try {
      return await this.startCheckInUseCase.execute({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        userId: req.user.id,
        distanceType: body.distanceType,
        startLatitude: body.startLatitude,
        startLongitude: body.startLongitude,
      });
    } catch (error) {
      if (error instanceof ActiveCheckInAlreadyExistsError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post("complete")
  @ApiOperation({ summary: "Complete an active check-in" })
  @UsePipes(ZodValidationPipe)
  async complete(@Request() req, @Body() body: CompleteCheckInDto) {
    try {
      return await this.completeCheckInUseCase.execute({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        userId: req.user.id,
        finalLatitude: body.finalLatitude,
        finalLongitude: body.finalLongitude,
      });
    } catch (error) {
      if (error instanceof ActiveCheckInNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get("active")
  @ApiOperation({ summary: "Get current active check-in for the user" })
  async getActive(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as { id: string };
    const checkIn = await this.getActiveCheckInUseCase.execute(user.id);
    return checkIn || null;
  }

  @Get("all-active")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all active check-ins for the dashboard" })
  async getAllActive() {
    return this.getAllActiveCheckInsUseCase.execute();
  }

  /** RN03 — lista todos os check-ins LATE com estágio de escalonamento (Admin) */
  @Get("late")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get all late check-ins with escalation stage (Admin only)",
  })
  async getLate() {
    return this.getLateCheckInsUseCase.execute();
  }

  /** RN03 — Admin encerra manualmente um check-in LATE */
  @Patch(":id/close")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Admin closes a late check-in manually" })
  async close(@Param("id") id: string) {
    try {
      return await this.closeCheckInUseCase.execute(id);
    } catch (error) {
      if (error instanceof CheckInNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /** RN03 — Admin escala manualmente para o próximo estágio sem aguardar o cron */
  @Patch(":id/escalate")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Admin manually escalates a late check-in to next stage",
  })
  async escalate(@Param("id") id: string) {
    try {
      return await this.escalateCheckInUseCase.execute(id);
    } catch (error) {
      if (error instanceof CheckInNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get detailed check-in by ID including user history count",
  })
  async getById(@Param("id") id: string) {
    try {
      return await this.getCheckInByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof CheckInNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
