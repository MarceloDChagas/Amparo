import { Notification } from "@/core/domain/entities/notification.entity";
import { GetUserNotificationsUseCase } from "@/core/use-cases/notification/get-user-notifications.use-case";
import { SendNotificationUseCase } from "@/core/use-cases/notification/send-notification.use-case";

describe("Notification use cases", () => {
  const notificationRepository = {
    create: jest.fn(),
    findForUser: jest.fn(),
    countUnreadForUser: jest.fn(),
    markAllReadForUser: jest.fn(),
    markReadById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an INFO notification by default", async () => {
    notificationRepository.create.mockImplementation(
      async (notification: Notification) => notification,
    );

    const result = await new SendNotificationUseCase(
      notificationRepository,
    ).execute({
      title: "Aviso",
      body: "Mensagem",
    });

    expect(result).toEqual(
      expect.objectContaining({
        title: "Aviso",
        body: "Mensagem",
        category: "INFO",
        targetId: null,
        read: false,
      }),
    );
    expect(notificationRepository.create).toHaveBeenCalledWith(
      expect.any(Notification),
    );
  });

  it("keeps explicit category and target", async () => {
    notificationRepository.create.mockImplementation(
      async (notification: Notification) => notification,
    );

    const result = await new SendNotificationUseCase(
      notificationRepository,
    ).execute({
      title: "Alerta",
      body: "Novo alerta",
      category: "ALERT",
      targetId: "alert-1",
    });

    expect(result).toEqual(
      expect.objectContaining({
        category: "ALERT",
        targetId: "alert-1",
      }),
    );
  });

  it("returns user notifications", async () => {
    const notifications = [{ id: "notification-1" }];
    notificationRepository.findForUser.mockResolvedValue(notifications);

    await expect(
      new GetUserNotificationsUseCase(notificationRepository).execute("user-1"),
    ).resolves.toEqual(notifications);
    expect(notificationRepository.findForUser).toHaveBeenCalledWith("user-1");
  });

  it("counts unread notifications", async () => {
    notificationRepository.countUnreadForUser.mockResolvedValue(3);

    await expect(
      new GetUserNotificationsUseCase(notificationRepository).countUnread(
        "user-1",
      ),
    ).resolves.toBe(3);
    expect(notificationRepository.countUnreadForUser).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("marks all notifications as read", async () => {
    notificationRepository.markAllReadForUser.mockResolvedValue(undefined);

    await expect(
      new GetUserNotificationsUseCase(notificationRepository).markAllRead(
        "user-1",
      ),
    ).resolves.toBeUndefined();
    expect(notificationRepository.markAllReadForUser).toHaveBeenCalledWith(
      "user-1",
    );
  });
});
