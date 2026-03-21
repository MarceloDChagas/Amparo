import {
  CallHandler,
  ExecutionContext,
  Injectable,
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
  constructor(private auditLogger: AuditLoggerPort) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url, ip } = request;
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        // Only log if user is authenticated (or we could log anonymous attempts too)
        if (user) {
          const log = new AuditLog({
            userId: user.id,
            action: method,
            resource: url,
            ipAddress: ip,
            createdAt: new Date(),
          });
          // RN07 — fire and forget: não bloqueia a resposta, mas garante o registro assíncrono.
          void this.auditLogger.log(log);
        }
      }),
    );
  }
}
