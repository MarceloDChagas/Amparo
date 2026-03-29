import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";

export interface CreateCheckInScheduleData {
  userId: string;
  name: string;
  destinationAddress?: string;
  destinationLat: number;
  destinationLng: number;
  expectedArrivalAt: Date;
  windowMinutes?: number;
}

/**
 * AM-157 — CheckInScheduleRepository
 * Persiste e consulta agendamentos de check-in inteligente.
 */
export interface ICheckInScheduleRepository {
  create(data: CreateCheckInScheduleData): Promise<CheckInSchedule>;
  findByUserId(userId: string): Promise<CheckInSchedule[]>;
  findById(id: string): Promise<CheckInSchedule | null>;

  /**
   * Retorna schedules PENDING cujo expectedArrivalAt já passou (< now).
   * A filtragem pelo windowMinutes é feita no use case.
   */
  findPendingExpired(now: Date): Promise<CheckInSchedule[]>;

  markAsArrived(id: string, arrivedAt: Date): Promise<CheckInSchedule>;
  markAsAlerted(id: string, alertedAt: Date): Promise<CheckInSchedule>;
  markAsCancelled(id: string): Promise<CheckInSchedule>;
  /**
   * RN10 — Retenção de Dados de Localização
   * Remove agendamentos finalizados (ARRIVED, ALERTED, CANCELLED) criados antes da data informada.
   * Registros PENDING não são afetados.
   * Retorna o número de registros deletados.
   */
  deleteCreatedBefore(date: Date): Promise<number>;
}
