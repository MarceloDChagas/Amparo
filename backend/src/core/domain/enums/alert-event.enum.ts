export const AlertEventType = {
  LOCATION_UPDATE: "LOCATION_UPDATE",
  NOTIFICATION_SENT: "NOTIFICATION_SENT",
  STATUS_CHANGE: "STATUS_CHANGE",
  COMMENT: "COMMENT",
  CREATED: "CREATED",
} as const;

export type AlertEventType =
  (typeof AlertEventType)[keyof typeof AlertEventType];

export const EventSource = {
  SYSTEM: "SYSTEM",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type EventSource = (typeof EventSource)[keyof typeof EventSource];
