import { AuditLog } from "../entities/audit-log.entity";

export abstract class AuditLoggerPort {
  abstract log(auditLog: AuditLog): Promise<void>;
}
