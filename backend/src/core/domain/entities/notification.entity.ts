export interface NotificationProps {
  id?: string;
  title: string;
  body: string;
  targetId?: string | null; // null = broadcast to all victims
  read?: boolean;
  createdAt?: Date;
}

export class Notification {
  id: string;
  title: string;
  body: string;
  targetId: string | null;
  read: boolean;
  createdAt: Date;

  constructor(props: NotificationProps) {
    this.id = props.id ?? "";
    this.title = props.title;
    this.body = props.body;
    this.targetId = props.targetId ?? null;
    this.read = props.read ?? false;
    this.createdAt = props.createdAt ?? new Date();
  }
}
