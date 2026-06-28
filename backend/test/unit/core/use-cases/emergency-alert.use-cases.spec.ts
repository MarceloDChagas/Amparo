import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { EmergencyAlertNotFoundError } from "@/core/errors/emergency-alert.errors";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetAllEmergencyAlertsUseCase } from "@/core/use-cases/get-all-emergency-alerts.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

// Valida os casos de uso de leitura de alertas e o registro de eventos do alerta.
describe("Emergency alert use-cases (unit)", () => {
  const emergencyAlertRepositoryMock = {
    findActive: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const alertEventRepositoryMock = {
    findByAlertId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GetActiveEmergencyAlertUseCase", () => {
    // Garante que retorna o alerta atualmente ativo.
    it("returns active alert", async () => {
      const useCase = new GetActiveEmergencyAlertUseCase(
        emergencyAlertRepositoryMock as never,
      );
      const activeAlert = { id: "alert-active", status: "ACTIVE" };

      emergencyAlertRepositoryMock.findActive.mockResolvedValue(activeAlert);

      await expect(useCase.execute()).resolves.toEqual(activeAlert);
      expect(emergencyAlertRepositoryMock.findActive).toHaveBeenCalledTimes(1);
    });
  });

  describe("GetAllEmergencyAlertsUseCase", () => {
    // Garante que lista todos os alertas.
    it("returns all alerts", async () => {
      const useCase = new GetAllEmergencyAlertsUseCase(
        emergencyAlertRepositoryMock as never,
      );
      const alerts = [{ id: "a-1" }, { id: "a-2" }];

      emergencyAlertRepositoryMock.findAll.mockResolvedValue(alerts);

      await expect(useCase.execute()).resolves.toEqual(alerts);
      expect(emergencyAlertRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("GetEmergencyAlertByIdUseCase", () => {
    // Garante que lança erro quando o alerta não existe.
    it("throws when alert does not exist", async () => {
      const useCase = new GetEmergencyAlertByIdUseCase(
        emergencyAlertRepositoryMock as never,
      );
      emergencyAlertRepositoryMock.findById.mockResolvedValue(null);

      await expect(useCase.execute("missing-alert")).rejects.toThrow(
        EmergencyAlertNotFoundError,
      );
    });

    // Garante que retorna o alerta quando encontrado.
    it("returns alert when found", async () => {
      const useCase = new GetEmergencyAlertByIdUseCase(
        emergencyAlertRepositoryMock as never,
      );
      const alert = { id: "alert-123", status: "ACTIVE" };

      emergencyAlertRepositoryMock.findById.mockResolvedValue(alert);

      await expect(useCase.execute("alert-123")).resolves.toEqual(alert);
      expect(emergencyAlertRepositoryMock.findById).toHaveBeenCalledWith(
        "alert-123",
      );
    });
  });

  describe("GetAlertHistoryUseCase", () => {
    // Garante que retorna o histórico de eventos de um alerta.
    it("returns alert event history", async () => {
      const useCase = new GetAlertHistoryUseCase(
        alertEventRepositoryMock as never,
      );
      const events = [{ id: "event-1", type: AlertEventType.CREATED }];

      alertEventRepositoryMock.findByAlertId.mockResolvedValue(events);

      await expect(useCase.execute({ alertId: "alert-1" })).resolves.toEqual(
        events,
      );
      expect(alertEventRepositoryMock.findByAlertId).toHaveBeenCalledWith(
        "alert-1",
      );
    });
  });

  describe("RecordAlertEventUseCase", () => {
    // Garante que um evento sem origem nasce com source SYSTEM e é salvo.
    it("creates event with default source and saves it", async () => {
      const useCase = new RecordAlertEventUseCase(
        alertEventRepositoryMock as never,
      );
      alertEventRepositoryMock.save.mockResolvedValue(undefined);

      const event = await useCase.execute({
        alertId: "alert-2",
        type: AlertEventType.NOTIFICATION_SENT,
        message: "Contato notificado",
      });

      expect(event.id).toBeDefined();
      expect(event.alertId).toBe("alert-2");
      expect(event.type).toBe(AlertEventType.NOTIFICATION_SENT);
      expect(event.source).toBe(EventSource.SYSTEM);
      expect(alertEventRepositoryMock.save).toHaveBeenCalledWith(event);
    });

    // Garante que origem e metadados informados são preservados.
    it("keeps custom source and metadata when provided", async () => {
      const useCase = new RecordAlertEventUseCase(
        alertEventRepositoryMock as never,
      );
      alertEventRepositoryMock.save.mockResolvedValue(undefined);

      const event = await useCase.execute({
        alertId: "alert-3",
        type: AlertEventType.STATUS_CHANGE,
        source: EventSource.ADMIN,
        message: "Admin atualizou status",
        metadata: '{"status":"IN_PROGRESS"}',
      });

      expect(event.source).toBe(EventSource.ADMIN);
      expect(event.metadata).toBe('{"status":"IN_PROGRESS"}');
    });
  });
});
