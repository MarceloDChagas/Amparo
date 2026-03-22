import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { CheckInRepository } from "@/core/domain/repositories/check-in-repository";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import type { IEmailService } from "@/core/domain/services/email-service.interface";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { SendNotificationUseCase } from "@/core/use-cases/notification/send-notification.use-case";

/**
 * RF03 — Check-in Inteligente (HIGH)
 * RN03 — Tolerância de Atraso no Check-in: escalonamento progressivo em 4 estágios.
 *
 * Estágio 0 → 1 (+5 min):  notificação in-app enviada ao usuário.
 * Estágio 1 → 2 (+15 min): e-mail ao contato de emergência prioridade 1.
 * Estágio 2 → 3 (+30 min): e-mail aos contatos prioridade 2 e 3.
 * Estágio 3 → 4 (+45 min): alerta crítico gerado no dashboard (admin).
 *
 * Admin pode encerrar ou escalar manualmente a qualquer momento via PATCH /check-ins/:id/close
 * ou PATCH /check-ins/:id/escalate.
 */

const MIN_5 = 5 * 60 * 1000;
const MIN_15 = 15 * 60 * 1000;
const MIN_30 = 30 * 60 * 1000;
const MIN_45 = 45 * 60 * 1000;

@Injectable()
export class OverdueCheckInCron {
  private readonly logger = new Logger(OverdueCheckInCron.name);

  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
    private readonly createEmergencyAlert: CreateEmergencyAlert,
    private readonly sendNotification: SendNotificationUseCase,
    @Inject("IEmergencyContactRepository")
    private readonly emergencyContactRepository: IEmergencyContactRepository,
    @Inject("IEmailService")
    private readonly emailService: IEmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();

    // ── Etapa 0: detecta novos check-ins vencidos (ACTIVE → LATE, stage=0) ──
    await this.markNewlyOverdue(now);

    // ── Etapas 1–4: escalonamento progressivo ──
    await this.runStage(0, now, MIN_5, (id, userId) =>
      this.sendInAppNotification(id, userId),
    );
    await this.runStage(1, now, MIN_15, (id, userId) =>
      this.emailPriorityOne(id, userId),
    );
    await this.runStage(2, now, MIN_30, (id, userId) =>
      this.emailPriorityTwoAndThree(id, userId),
    );
    await this.runStage(3, now, MIN_45, (id, userId) =>
      this.createCriticalAlert(id, userId),
    );
  }

  // ────────────────────────────────────────────────────────────────
  // Helpers privados
  // ────────────────────────────────────────────────────────────────

  private async markNewlyOverdue(now: Date) {
    // Busca diretamente no Prisma para evitar carregar todos os ativos
    // O repositório delega para findLateForEscalation mas aqui precisamos de ACTIVE,
    // então usamos o método do repositório que já conhece a query certa.
    try {
      // Reutiliza findAllActive e filtra localmente — o volume de ACTIVE tende a ser pequeno.
      const active = await this.checkInRepository.findAllActive();
      const overdue = active.filter((c) => c.expectedArrivalTime < now);

      for (const checkIn of overdue) {
        try {
          await this.checkInRepository.updateEscalation(checkIn.id, 0, now);
          this.logger.warn(
            `Check-in ${checkIn.id} do usuário ${checkIn.userId} marcado como LATE (stage=0)`,
          );
        } catch (err) {
          this.logger.error(
            `Erro ao marcar check-in ${checkIn.id} como LATE: ${String(err)}`,
          );
        }
      }
    } catch (err) {
      this.logger.warn(`Falha ao buscar check-ins ativos: ${String(err)}`);
    }
  }

  private async runStage(
    stage: number,
    now: Date,
    delay: number,
    action: (checkInId: string, userId: string) => Promise<void>,
  ) {
    const threshold = new Date(now.getTime() - delay);
    let records: Awaited<
      ReturnType<CheckInRepository["findLateForEscalation"]>
    >;
    try {
      records = await this.checkInRepository.findLateForEscalation(
        stage,
        threshold,
      );
    } catch (err) {
      this.logger.warn(`Falha ao buscar stage ${stage}: ${String(err)}`);
      return;
    }

    for (const checkIn of records) {
      try {
        await action(checkIn.id, checkIn.userId);
        await this.checkInRepository.updateEscalation(checkIn.id, stage + 1);
        this.logger.log(
          `Check-in ${checkIn.id}: stage ${stage} → ${stage + 1} concluído`,
        );
      } catch (err) {
        this.logger.error(
          `Erro no stage ${stage} para check-in ${checkIn.id}: ${String(err)}`,
        );
      }
    }
  }

  // ── Stage 0 → 1: notificação in-app para o usuário ──
  private async sendInAppNotification(
    _checkInId: string,
    userId: string,
  ): Promise<void> {
    await this.sendNotification.execute({
      title: "Prazo de chegada esgotado",
      body: "Você não confirmou a chegada no prazo informado. Seus contatos de emergência serão avisados em breve se você não confirmar.",
      category: "WARNING",
      targetId: userId,
    });
  }

  // ── Stage 1 → 2: e-mail ao contato prioridade 1 ──
  private async emailPriorityOne(
    _checkInId: string,
    userId: string,
  ): Promise<void> {
    const contacts = await this.emergencyContactRepository.findByUserId(userId);
    const p1 = contacts
      .filter((c) => c.email)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 1);

    for (const contact of p1) {
      await this.emailService.sendEmergencyNotification(
        contact.email!,
        "⚠️ Amparo — Trajeto em atraso",
        this.buildCheckInEmailHtml(contact.name, "15 minutos"),
      );
      this.logger.log(
        `E-mail P1 enviado para ${contact.email} (userId ${userId})`,
      );
    }
  }

  // ── Stage 2 → 3: e-mail aos contatos prioridade 2 e 3 ──
  private async emailPriorityTwoAndThree(
    _checkInId: string,
    userId: string,
  ): Promise<void> {
    const contacts = await this.emergencyContactRepository.findByUserId(userId);
    const p2p3 = contacts
      .filter((c) => c.email && c.priority >= 2)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 2);

    for (const contact of p2p3) {
      await this.emailService.sendEmergencyNotification(
        contact.email!,
        "🚨 Amparo — Alerta de trajeto",
        this.buildCheckInEmailHtml(contact.name, "30 minutos"),
      );
      this.logger.log(
        `E-mail P2/P3 enviado para ${contact.email} (userId ${userId})`,
      );
    }
  }

  // ── Stage 3 → 4: alerta crítico no dashboard (admin) ──
  private async createCriticalAlert(
    _checkInId: string,
    userId: string,
  ): Promise<void> {
    await this.createEmergencyAlert.execute({
      userId,
      latitude: 0,
      longitude: 0,
      address:
        "ALERTA CRÍTICO: Usuário não confirmou chegada há 45+ minutos e não respondeu às notificações.",
    });
    this.logger.warn(
      `Alerta crítico criado no dashboard para o usuário ${userId} (45min sem confirmação)`,
    );
  }

  // ── Template de e-mail ──
  private buildCheckInEmailHtml(
    contactName: string,
    elapsedLabel: string,
  ): string {
    const safe = (s: string) =>
      s.replace(/[&<>"'/]/g, (c) => {
        switch (c) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&#x27;";
          case "/":
            return "&#x2F;";
          default:
            return c;
        }
      });

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
  .wrap { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
  .body { background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
  .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
  .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px; }
</style></head>
<body><div class="wrap">
  <div class="header"><h2>⚠️ Trajeto em atraso — Amparo</h2></div>
  <div class="body">
    <p>Olá, <strong>${safe(contactName)}</strong>.</p>
    <div class="alert">
      <strong>Atenção:</strong> Um usuário que te cadastrou como contato de emergência
      não confirmou a chegada ao destino há mais de <strong>${safe(elapsedLabel)}</strong>.
    </div>
    <p>Se você tiver contato com essa pessoa, tente verificar se está bem.
       Caso não consiga contato, considere acionar as autoridades locais.</p>
    <p>Este aviso foi enviado automaticamente pelo <strong>Amparo</strong>,
       plataforma de proteção de mulheres em situação de violência doméstica.</p>
    <div class="footer">Você recebeu este e-mail por ser contato de emergência cadastrado no Amparo.</div>
  </div>
</div></body></html>`;
  }
}
