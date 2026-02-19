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
          // Fire and forget - don't await to avoid blocking response
          void this.auditLogger.log(log);
        }
      }),
    );
  }
}
