import { Logger } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import { EmailEmergencyAlertNotificationAdapter } from "@/infra/adapters/email-emergency-alert-notification.adapter";

// Valida o adapter que notifica contatos por e-mail ao disparar um alerta de emergência.
describe("EmailEmergencyAlertNotificationAdapter", () => {
  const emergencyContactRepository = {
    findByUserId: jest.fn(),
  };
  const userRepository = {
    findById: jest.fn(),
  };
  const emailService = {
    sendEmergencyNotification: jest.fn(),
  };
  const templateRenderer = {
    renderEmergencyAlert: jest.fn(),
  };
  const notificationLogRepository = {
    create: jest.fn(),
  };
  const recordAlertEvent = {
    execute: jest.fn(),
  };

  const makeAdapter = () =>
    new EmailEmergencyAlertNotificationAdapter(
      emergencyContactRepository as never,
      userRepository as never,
      emailService as never,
      templateRenderer,
      notificationLogRepository as never,
      recordAlertEvent as never,
    );

  const alert = new EmergencyAlert(
    "alert-1",
    -23.5505,
    -46.6333,
    new Date("2026-06-17T12:00:00.000Z"),
    AlertStatus.PENDING,
    "Rua Segura, 123",
    "user-1",
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Garante que alerta anônimo (sem usuário) não busca contatos nem envia e-mail.
  it("does nothing for anonymous alerts", async () => {
    await makeAdapter().notify(
      new EmergencyAlert(
        "alert-1",
        -23.5505,
        -46.6333,
        new Date(),
        AlertStatus.PENDING,
      ),
    );

    expect(emergencyContactRepository.findByUserId).not.toHaveBeenCalled();
  });

  // Garante que sem contatos cadastrados nada é enviado.
  it("does nothing when user has no emergency contacts", async () => {
    emergencyContactRepository.findByUserId.mockResolvedValue([]);

    await makeAdapter().notify(alert);

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(emailService.sendEmergencyNotification).not.toHaveBeenCalled();
  });

  // Garante que envia só a contatos com e-mail, registra log de sucesso e o evento do alerta.
  it("sends email only to contacts with email and records success", async () => {
    emergencyContactRepository.findByUserId.mockResolvedValue([
      { name: "Contato 1", email: "contact1@example.com" },
      { name: "Contato 2", email: null },
    ]);
    userRepository.findById.mockResolvedValue({ id: "user-1", name: "Maria" });
    templateRenderer.renderEmergencyAlert.mockReturnValue("<p>alerta</p>");
    emailService.sendEmergencyNotification.mockResolvedValue(undefined);
    notificationLogRepository.create.mockResolvedValue({});
    recordAlertEvent.execute.mockResolvedValue({});

    await makeAdapter().notify(alert);

    expect(templateRenderer.renderEmergencyAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        userName: "Maria",
        locationLink: "https://www.google.com/maps?q=-23.5505,-46.6333",
        address: "Rua Segura, 123",
      }),
    );
    expect(emailService.sendEmergencyNotification).toHaveBeenCalledWith(
      "contact1@example.com",
      "ALERTA DE EMERGÊNCIA - AMPARO",
      "<p>alerta</p>",
    );
    expect(notificationLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        alertId: "alert-1",
        contactEmail: "contact1@example.com",
        status: "SENT",
        attempt: 1,
      }),
    );
    expect(recordAlertEvent.execute).toHaveBeenCalledWith({
      alertId: "alert-1",
      type: AlertEventType.NOTIFICATION_SENT,
      source: EventSource.SYSTEM,
      message: "Notificação enviada para Contato 1",
      metadata: JSON.stringify({
        email: "contact1@example.com",
        contactName: "Contato 1",
        channel: "EMAIL",
        attempt: 1,
      }),
    });
  });

  // Garante que erros do repositório são logados e engolidos (notify não rejeita).
  it("logs and swallows repository errors", async () => {
    emergencyContactRepository.findByUserId.mockRejectedValue(
      new Error("database unavailable"),
    );

    await expect(makeAdapter().notify(alert)).resolves.toBeUndefined();
    expect(Logger.prototype.error).toHaveBeenCalledWith(
      "Error notifying contacts: database unavailable",
      expect.any(String),
    );
  });
});
