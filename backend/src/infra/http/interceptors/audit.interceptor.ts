import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import { Role } from "@/core/domain/enums/role.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";

interface RequestWithUser {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
  method: string;
  url: string;
  ip: string;
}

/**
 * RF14 — Log de Auditoria (MEDIUM — NOK: implementação parcial)
 * Registra automaticamente toda requisição HTTP autenticada: quem acessou,
 * qual recurso, qual método e de qual IP. Aplicado globalmente via interceptor.
 *
 * RN07 — Histórico Imutável de Ocorrências (Append-only)
 * Logs de auditoria são sempre inseridos (nunca atualizados), garantindo
 * trilha de rastreabilidade com validade jurídica.
 *
 * NRF01 — Conformidade Legal (LGPD)
 * Rastreia qual gestor/autoridade acessou dados sensíveis das vítimas,
 * em conformidade com os requisitos de transparência da LGPD.
 *
 * Nota: RF14 está como NOK pois ainda não há interface no Dashboard Operacional
 * para consulta dos logs de auditoria — o backend registra, mas não expõe.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private auditLogger: AuditLoggerPort) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url, ip } = request;
    const user = request.user;

    // GETs não representam ações do usuário — não têm valor na trilha de auditoria.
    if (method === "GET") return next.handle();

    this.logger.log(
      `[audit] ${method} ${url} — user: ${user?.id ?? "anonymous"}`,
    );

    return next.handle().pipe(
      tap(() => {
        if (user) {
          const log = new AuditLog({
            userId: user.id,
            action: method,
            resource: url,
            ipAddress: ip,
            createdAt: new Date(),
          });
          this.auditLogger.log(log).catch((err: unknown) => {
            this.logger.error("Falha ao salvar audit log", err);
          });
        } else {
          this.logger.warn(
            `[audit] tap disparou mas user é undefined — ${method} ${url}`,
          );
        }
      }),
    );
  }
}
