import { Inject, Injectable } from "@nestjs/common";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import {
  DistanceTolerances,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import {
  CheckInRepository,
  CreateCheckInData,
} from "@/core/domain/repositories/check-in-repository";
import { ActiveCheckInAlreadyExistsError } from "@/core/errors/check-in.errors";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

interface StartCheckInRequest {
  userId: string;
  distanceType: DistanceType;
  startLatitude?: number;
  startLongitude?: number;
}

/**
 * RF03 — Check-in Inteligente (HIGH)
 * Inicia o monitoramento de rota segura para a usuária.
 * O prazo de chegada (`expectedArrivalTime`) é calculado com base no tipo
 * de distância escolhido, usando as tolerâncias definidas em `DistanceTolerances`.
 *
 * RN03 — Tolerância de Atraso no Check-in
 * O `expectedArrivalTime` define a janela de tolerância. Se a usuária não
 * confirmar chegada antes desse prazo, o `OverdueCheckInCron` detecta e
 * escalona alertas progressivamente (ver overdue-check-in.cron.ts).
 */
@Injectable()
export class StartCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private checkInRepository: CheckInRepository,
    private auditLogger: AuditLoggerPort,
  ) {}

  async execute(request: StartCheckInRequest) {
    const { userId, distanceType, startLatitude, startLongitude } = request;

    const existingCheckIn =
      await this.checkInRepository.findActiveByUserId(userId);

    if (existingCheckIn) {
      throw new ActiveCheckInAlreadyExistsError();
    }

    // RN03 — calcula o prazo máximo de chegada com base no tipo de distância selecionado.
    // eslint-disable-next-line security/detect-object-injection
    const toleranceMinutes = DistanceTolerances[distanceType];
    const now = new Date();
    const expectedArrivalTime = new Date(
      now.getTime() + toleranceMinutes * 60 * 1000,
    );

    const createData: CreateCheckInData = {
      userId,
      distanceType,
      startTime: now,
      expectedArrivalTime,
      startLatitude,
      startLongitude,
      status: "ACTIVE",
    };

    const checkIn = await this.checkInRepository.create(createData);

    await this.auditLogger.log(
      new AuditLog({
        action: "START_CHECK_IN",
        resource: "CheckIn",
        resourceId: checkIn.id,
        userId: userId,
      }),
    );

    return checkIn;
  }
}
