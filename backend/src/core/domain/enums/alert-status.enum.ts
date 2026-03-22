export const AlertStatus = {
  PENDING: "PENDING",
  DISPATCHED: "DISPATCHED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type AlertStatus = (typeof AlertStatus)[keyof typeof AlertStatus];

/**
 * Máquina de estados do ciclo de vida de um alerta.
 * PENDING     → DISPATCHED | CANCELLED
 * DISPATCHED  → COMPLETED  | CANCELLED
 * COMPLETED   → (terminal)
 * CANCELLED   → (terminal)
 */
export const VALID_TRANSITIONS: Record<AlertStatus, AlertStatus[]> = {
  [AlertStatus.PENDING]: [AlertStatus.DISPATCHED, AlertStatus.CANCELLED],
  [AlertStatus.DISPATCHED]: [AlertStatus.COMPLETED, AlertStatus.CANCELLED],
  [AlertStatus.COMPLETED]: [],
  [AlertStatus.CANCELLED]: [],
};
