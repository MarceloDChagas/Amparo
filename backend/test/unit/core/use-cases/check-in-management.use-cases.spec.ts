import { Logger } from "@nestjs/common";

import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";
import { DistanceType } from "@/core/domain/enums/distance-type.enum";
import {
  CheckInRecord,
  CheckInRepository,
} from "@/core/domain/repositories/check-in-repository";
import { ICheckInScheduleRepository } from "@/core/domain/repositories/check-in-schedule-repository.interface";
import {
  CheckInNotFoundError,
  CheckInScheduleNotFoundError,
} from "@/core/errors/check-in.errors";
import { ConfirmCheckInArrivalUseCase } from "@/core/use-cases/confirm-check-in-arrival.use-case";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { DefineCheckInSafeLocationUseCase } from "@/core/use-cases/define-check-in-safe-location.use-case";
import { EscalateCheckInUseCase } from "@/core/use-cases/escalate-check-in.use-case";
import { GetCheckInSchedulesUseCase } from "@/core/use-cases/get-check-in-schedules.use-case";
import { MonitorCheckInUseCase } from "@/core/use-cases/monitor-check-in.use-case";
import { PurgeLocationDataUseCase } from "@/core/use-cases/purge-location-data.use-case";

// Valida o ciclo de vida do check-in agendado: destino seguro, confirmação de chegada,
// escalonamento, monitoramento (gera alerta após a janela de tolerância) e purga de dados.
describe("Check-in management use cases", () => {
  const now = new Date("2026-06-17T12:00:00.000Z");

  let checkInRepository: jest.Mocked<CheckInRepository>;
  let scheduleRepository: jest.Mocked<ICheckInScheduleRepository>;
  let createEmergencyAlert: { execute: jest.Mock };

  const makeCheckIn = (
    overrides: Partial<CheckInRecord> = {},
  ): CheckInRecord => ({
    id: "check-in-1",
    userId: "user-1",
    startTime: new Date("2026-06-17T10:00:00.000Z"),
    expectedArrivalTime: new Date("2026-06-17T10:30:00.000Z"),
    distanceType: DistanceType.SHORT,
    status: "ACTIVE",
    createdAt: new Date("2026-06-17T10:00:00.000Z"),
    updatedAt: new Date("2026-06-17T10:00:00.000Z"),
    ...overrides,
  });

  const makeSchedule = (
    overrides: Partial<CheckInSchedule> = {},
  ): CheckInSchedule =>
    new CheckInSchedule({
      id: "schedule-1",
      userId: "user-1",
      name: "Casa",
      destinationAddress: "Rua Segura, 123",
      destinationLat: -23.5505,
      destinationLng: -46.6333,
      expectedArrivalAt: new Date("2026-06-17T11:30:00.000Z"),
      windowMinutes: 15,
      status: "PENDING",
      createdAt: new Date("2026-06-17T10:00:00.000Z"),
      updatedAt: new Date("2026-06-17T10:00:00.000Z"),
      ...overrides,
    });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);

    checkInRepository = {
      findActiveByUserId: jest.fn(),
      findAllActive: jest.fn(),
      findAllLate: jest.fn(),
      findLateForEscalation: jest.fn(),
      findById: jest.fn(),
      findDetailedById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      complete: jest.fn(),
      updateEscalation: jest.fn(),
      closeByAdmin: jest.fn(),
      deleteCreatedBefore: jest.fn(),
    };

    scheduleRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      findPendingExpired: jest.fn(),
      markAsArrived: jest.fn(),
      markAsAlerted: jest.fn(),
      markAsCancelled: jest.fn(),
      deleteCreatedBefore: jest.fn(),
    };

    createEmergencyAlert = {
      execute: jest.fn(),
    };

    jest.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("DefineCheckInSafeLocationUseCase", () => {
    // Garante que cria o agendamento com destino e horário esperado de chegada.
    it("creates a schedule with destination and expected arrival", async () => {
      const schedule = makeSchedule();
      const data = {
        userId: "user-1",
        name: "Casa",
        destinationAddress: "Rua Segura, 123",
        destinationLat: -23.5505,
        destinationLng: -46.6333,
        expectedArrivalAt: new Date("2026-06-17T11:30:00.000Z"),
        windowMinutes: 15,
      };
      scheduleRepository.create.mockResolvedValue(schedule);

      await expect(
        new DefineCheckInSafeLocationUseCase(scheduleRepository).execute(data),
      ).resolves.toEqual(schedule);
      expect(scheduleRepository.create).toHaveBeenCalledWith(data);
    });
  });

  describe("ConfirmCheckInArrivalUseCase", () => {
    // Garante erro quando o agendamento não existe.
    it("throws when schedule does not exist", async () => {
      scheduleRepository.findById.mockResolvedValue(null);

      await expect(
        new ConfirmCheckInArrivalUseCase(scheduleRepository).execute(
          "missing",
          "user-1",
        ),
      ).rejects.toThrow(CheckInScheduleNotFoundError);
      expect(scheduleRepository.markAsArrived).not.toHaveBeenCalled();
    });

    // Garante que não confirma chegada de agendamento de outro usuário (isolamento).
    it("throws when schedule belongs to another user", async () => {
      scheduleRepository.findById.mockResolvedValue(
        makeSchedule({ userId: "other-user" }),
      );

      await expect(
        new ConfirmCheckInArrivalUseCase(scheduleRepository).execute(
          "schedule-1",
          "user-1",
        ),
      ).rejects.toThrow(CheckInScheduleNotFoundError);
      expect(scheduleRepository.markAsArrived).not.toHaveBeenCalled();
    });

    // Garante que o dono confirma a chegada e o agendamento é marcado como ARRIVED.
    it("marks schedule as arrived for its owner", async () => {
      const arrived = makeSchedule({ status: "ARRIVED", arrivedAt: now });
      scheduleRepository.findById.mockResolvedValue(makeSchedule());
      scheduleRepository.markAsArrived.mockResolvedValue(arrived);

      await expect(
        new ConfirmCheckInArrivalUseCase(scheduleRepository).execute(
          "schedule-1",
          "user-1",
        ),
      ).resolves.toEqual(arrived);
      expect(scheduleRepository.markAsArrived).toHaveBeenCalledWith(
        "schedule-1",
        now,
      );
    });
  });

  describe("GetCheckInSchedulesUseCase", () => {
    // Garante que retorna os agendamentos do usuário.
    it("returns schedules owned by a user", async () => {
      const schedules = [makeSchedule()];
      scheduleRepository.findByUserId.mockResolvedValue(schedules);

      await expect(
        new GetCheckInSchedulesUseCase(scheduleRepository).execute("user-1"),
      ).resolves.toEqual(schedules);
      expect(scheduleRepository.findByUserId).toHaveBeenCalledWith("user-1");
    });
  });

  describe("EscalateCheckInUseCase", () => {
    // Garante erro ao escalonar check-in inexistente.
    it("throws when check-in does not exist", async () => {
      checkInRepository.findById.mockResolvedValue(null);

      await expect(
        new EscalateCheckInUseCase(checkInRepository).execute("missing"),
      ).rejects.toThrow(CheckInNotFoundError);
      expect(checkInRepository.updateEscalation).not.toHaveBeenCalled();
    });

    // Garante que o estágio de escalonamento inicia em 1 quando ainda não definido.
    it("increments an unset escalation stage from zero", async () => {
      checkInRepository.findById.mockResolvedValue(makeCheckIn());

      await expect(
        new EscalateCheckInUseCase(checkInRepository).execute("check-in-1"),
      ).resolves.toEqual(expect.objectContaining({ escalationStage: 1 }));
      expect(checkInRepository.updateEscalation).toHaveBeenCalledWith(
        "check-in-1",
        1,
      );
    });

    // Garante que no estágio máximo o check-in não é mais escalonado.
    it("returns unchanged check-in at max escalation stage", async () => {
      const maxStage = makeCheckIn({ escalationStage: 4 });
      checkInRepository.findById.mockResolvedValue(maxStage);

      await expect(
        new EscalateCheckInUseCase(checkInRepository).execute("check-in-1"),
      ).resolves.toEqual(maxStage);
      expect(checkInRepository.updateEscalation).not.toHaveBeenCalled();
    });
  });

  describe("MonitorCheckInUseCase", () => {
    // Garante que dentro da janela de tolerância nenhum alerta é gerado.
    it("ignores expired schedules while still inside tolerance window", async () => {
      scheduleRepository.findPendingExpired.mockResolvedValue([
        makeSchedule({
          expectedArrivalAt: new Date("2026-06-17T11:50:00.000Z"),
          windowMinutes: 15,
        }),
      ]);

      await new MonitorCheckInUseCase(
        scheduleRepository,
        createEmergencyAlert as unknown as CreateEmergencyAlert,
      ).execute();

      expect(createEmergencyAlert.execute).not.toHaveBeenCalled();
      expect(scheduleRepository.markAsAlerted).not.toHaveBeenCalled();
    });

    // Garante que após a janela de tolerância gera alerta e marca o agendamento como ALERTED.
    it("creates an emergency alert and marks schedule as alerted after tolerance window", async () => {
      scheduleRepository.findPendingExpired.mockResolvedValue([makeSchedule()]);

      await new MonitorCheckInUseCase(
        scheduleRepository,
        createEmergencyAlert as unknown as CreateEmergencyAlert,
      ).execute();

      expect(createEmergencyAlert.execute).toHaveBeenCalledWith({
        userId: "user-1",
        latitude: -23.5505,
        longitude: -46.6333,
        address: "Rua Segura, 123",
      });
      expect(scheduleRepository.markAsAlerted).toHaveBeenCalledWith(
        "schedule-1",
        now,
      );
    });

    // Garante o uso de um endereço de fallback quando o agendamento não tem endereço.
    it("uses a fallback address when schedule has no destination address", async () => {
      scheduleRepository.findPendingExpired.mockResolvedValue([
        makeSchedule({
          destinationAddress: null,
          name: "Trabalho",
        }),
      ]);

      await new MonitorCheckInUseCase(
        scheduleRepository,
        createEmergencyAlert as unknown as CreateEmergencyAlert,
      ).execute();

      expect(createEmergencyAlert.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          address: "Destino: Trabalho (check-in não confirmado)",
        }),
      );
    });

    // Garante resiliência: se um alerta falha, os agendamentos seguintes continuam sendo processados.
    it("keeps processing later schedules when alert creation fails", async () => {
      scheduleRepository.findPendingExpired.mockResolvedValue([
        makeSchedule({ id: "schedule-1" }),
        makeSchedule({ id: "schedule-2" }),
      ]);
      createEmergencyAlert.execute
        .mockRejectedValueOnce(new Error("notification failed"))
        .mockResolvedValueOnce(undefined);

      await new MonitorCheckInUseCase(
        scheduleRepository,
        createEmergencyAlert as unknown as CreateEmergencyAlert,
      ).execute();

      expect(createEmergencyAlert.execute).toHaveBeenCalledTimes(2);
      expect(scheduleRepository.markAsAlerted).toHaveBeenCalledTimes(1);
      expect(scheduleRepository.markAsAlerted).toHaveBeenCalledWith(
        "schedule-2",
        now,
      );
    });
  });

  describe("PurgeLocationDataUseCase", () => {
    // Garante que remove dados de localização anteriores ao período de retenção (LGPD).
    it("removes location tracking data older than retention period", async () => {
      checkInRepository.deleteCreatedBefore.mockResolvedValue(2);
      scheduleRepository.deleteCreatedBefore.mockResolvedValue(3);

      await expect(
        new PurgeLocationDataUseCase(
          checkInRepository,
          scheduleRepository,
        ).execute(),
      ).resolves.toEqual({
        checkInsDeleted: 2,
        schedulesDeleted: 3,
        cutoffDate: new Date("2026-04-18T12:00:00.000Z"),
      });
      expect(checkInRepository.deleteCreatedBefore).toHaveBeenCalledWith(
        new Date("2026-04-18T12:00:00.000Z"),
      );
      expect(scheduleRepository.deleteCreatedBefore).toHaveBeenCalledWith(
        new Date("2026-04-18T12:00:00.000Z"),
      );
    });
  });
});
