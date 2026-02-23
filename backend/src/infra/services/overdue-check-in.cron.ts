import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { CheckInStatus } from "@/core/domain/enums/distance-type.enum";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class OverdueCheckInCron {
  private readonly logger = new Logger(OverdueCheckInCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly createEmergencyAlert: CreateEmergencyAlert,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug("Buscando check-ins atrasados...");

    const now = new Date();

    const overdueCheckIns = await this.prisma.checkIn.findMany({
      where: {
        status: "ACTIVE",
        expectedArrivalTime: {
          lt: now, // Expected arrival time has already passed
        },
      },
      include: {
        user: true,
      },
    });

    if (overdueCheckIns.length === 0) {
      return;
    }

    this.logger.warn(
      `Encontrados ${overdueCheckIns.length} check-ins vencidos.`,
    );

    for (const checkIn of overdueCheckIns) {
      try {
        await this.prisma.checkIn.update({
          where: { id: checkIn.id },
          data: {
            status: CheckInStatus.LATE,
            actualArrivalTime: now,
          },
        });

        const lat = checkIn.startLatitude ?? 0;
        const lng = checkIn.startLongitude ?? 0;

        await this.createEmergencyAlert.execute({
          userId: checkIn.userId,
          latitude: lat,
          longitude: lng,
          address:
            "Alerta automático: Falha na verificação de chegada dentro do tempo esperado.",
        });

        this.logger.log(
          `Alerta de emergência gerado para o check-in atrasado do usuário ${checkIn.userId}`,
        );
      } catch (error) {
        this.logger.error(
          `Erro ao processar check-in atrasado ${checkIn.id}: `,
          error,
        );
      }
    }
  }
}
