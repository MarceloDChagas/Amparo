import * as crypto from "crypto";

import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";

export class AlertEvent {
  constructor(
    public readonly id: string,
    public readonly alertId: string,
    public readonly type: AlertEventType,
    public readonly source: EventSource,
    public readonly message: string,
    public readonly metadata: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(
    props: {
      alertId: string;
      type: AlertEventType;
      source?: EventSource;
      message: string;
      metadata?: string | null;
    },
    id?: string,
    createdAt?: Date,
  ): AlertEvent {
    return new AlertEvent(
      id ?? crypto.randomUUID(),
      props.alertId,
      props.type,
      props.source ?? "SYSTEM",
      props.message,
      props.metadata ?? null,
      createdAt ?? new Date(),
    );
  }
}
