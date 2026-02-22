export type NotificationChannel = "EMAIL" | "PUSH";
export type NotificationStatus = "SENT" | "FAILED";

interface NotificationLogProps {
  id?: string;
  alertId: string;
  contactEmail?: string;
  contactName: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  errorMessage?: string;
  attempt?: number;
  createdAt?: Date;
}

export class NotificationLog {
  id: string;
  alertId: string;
  contactEmail?: string;
  contactName: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  errorMessage?: string;
  attempt: number;
  createdAt: Date;

  constructor(props: NotificationLogProps) {
    this.id = props.id ?? "";
    this.alertId = props.alertId;
    this.contactEmail = props.contactEmail;
    this.contactName = props.contactName;
    this.channel = props.channel;
    this.status = props.status;
    this.errorMessage = props.errorMessage;
    this.attempt = props.attempt ?? 1;
    this.createdAt = props.createdAt ?? new Date();
  }
}
