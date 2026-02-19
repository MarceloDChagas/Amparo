export class AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  createdAt: Date;

  constructor(props: Partial<AuditLog>) {
    Object.assign(this, props);
  }
}
