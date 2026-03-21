import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { CheckInStatus } from "@/core/domain/enums/distance-type.enum";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { PrismaService } from "@/infra/database/prisma.service";

/**
 * RF03 — Check-in Inteligente (HIGH)
 * Monitora check-ins que ultrapassaram o `expectedArrivalTime` sem confirmação
 * de chegada. Executa a cada minuto para detectar vencimentos em tempo hábil.
 *
 * RN03 — Tolerância de Atraso no Check-in (NOK — parcialmente implementado)
 * A regra prevê alertas progressivos (in-app +5min → e-mail contato P1 +15min →
 * contatos P2/P3 +30min → alerta crítico no dashboard +45min). Atualmente o cron
 * dispara o alerta de emergência diretamente ao detectar o vencimento, sem
 * os estágios intermediários de "alertas de desperta" para os contatos.
 *
 * RF13/RF17 — Gestão e Evolução de Casos
 * O cron marca o check-in como LATE, alterando seu ciclo de vida no dashboard.
 */
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

    // RN03 — busca check-ins ativos cujo prazo já passou.
    let overdueCheckIns: Awaited<
      ReturnType<typeof this.prisma.checkIn.findMany>
    >;
    try {
      overdueCheckIns = await this.prisma.checkIn.findMany({
        where: {
          status: "ACTIVE",
          expectedArrivalTime: { lt: now },
        },
        include: { user: true },
      });
    } catch (err) {
      this.logger.warn(
        `Falha ao consultar check-ins (conexão instável): ${String(err)}`,
      );
      return;
    }

    if (overdueCheckIns.length === 0) {
      return;
    }

    this.logger.warn(
      `Encontrados ${overdueCheckIns.length} check-ins vencidos.`,
    );

    for (const checkIn of overdueCheckIns) {
      try {
        // RF13/RF17 — atualiza o status do check-in para LATE no ciclo de vida.
        await this.prisma.checkIn.update({
          where: { id: checkIn.id },
          data: {
            status: CheckInStatus.LATE,
            actualArrivalTime: now,
          },
        });

        const lat = checkIn.startLatitude ?? 0;
        const lng = checkIn.startLongitude ?? 0;

        // RN03 / RF01 — escala para alerta de emergência completo (RF01)
        // por não ter confirmação de chegada dentro do prazo esperado.
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
