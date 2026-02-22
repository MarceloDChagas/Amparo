export type NotificationCategory =
  | "ALERT"
  | "SUCCESS"
  | "WARNING"
  | "INFO"
  | "MAINTENANCE";

export interface NotificationProps {
  id?: string;
  title: string;
  body: string;
  category?: NotificationCategory;
  targetId?: string | null;
  read?: boolean;
  createdAt?: Date;
}

export class Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  targetId: string | null;
  read: boolean;
  createdAt: Date;

  constructor(props: NotificationProps) {
    this.id = props.id ?? "";
    this.title = props.title;
    this.body = props.body;
    this.category = props.category ?? "INFO";
    this.targetId = props.targetId ?? null;
    this.read = props.read ?? false;
    this.createdAt = props.createdAt ?? new Date();
  }
}
