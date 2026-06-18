import { Logger } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";

describe("Occurrence use cases", () => {
  const occurrenceRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const sendEmergencyNotificationUseCase = {
    execute: jest.fn(),
  };

  const heatMapRepository = {
    findAll: jest.fn(),
    replaceAll: jest.fn(),
    upsertFromOccurrence: jest.fn(),
  };

  const occurrence = new Occurrence({
    id: "occurrence-1",
    description: "Pedido de ajuda",
    latitude: -23.5505,
    longitude: -46.6333,
    userId: "user-1",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("creates an occurrence and starts async side effects", async () => {
    occurrenceRepository.create.mockResolvedValue(occurrence);
    heatMapRepository.upsertFromOccurrence.mockResolvedValue(undefined);
    sendEmergencyNotificationUseCase.execute.mockResolvedValue({
      emailsSent: 1,
      emailsFailed: 0,
      totalContacts: 1,
    });

    const result = await new CreateOccurrenceUseCase(
      occurrenceRepository as never,
      sendEmergencyNotificationUseCase as never,
      heatMapRepository as never,
    ).execute(occurrence);

    await Promise.resolve();

    expect(result).toEqual(occurrence);
    expect(occurrenceRepository.create).toHaveBeenCalledWith(occurrence);
    expect(heatMapRepository.upsertFromOccurrence).toHaveBeenCalledWith(
      occurrence,
    );
    expect(sendEmergencyNotificationUseCase.execute).toHaveBeenCalledWith(
      "user-1",
      occurrence,
    );
  });

  it("does not fail creation when heat map update rejects", async () => {
    occurrenceRepository.create.mockResolvedValue(occurrence);
    heatMapRepository.upsertFromOccurrence.mockRejectedValue(
      new Error("heat map failed"),
    );
    sendEmergencyNotificationUseCase.execute.mockResolvedValue({
      emailsSent: 0,
      emailsFailed: 0,
      totalContacts: 0,
    });

    await expect(
      new CreateOccurrenceUseCase(
        occurrenceRepository as never,
        sendEmergencyNotificationUseCase as never,
        heatMapRepository as never,
      ).execute(occurrence),
    ).resolves.toEqual(occurrence);
    await Promise.resolve();

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      expect.stringContaining("Falha ao atualizar heat map"),
    );
  });

  it("logs async notification failures without rejecting creation", async () => {
    occurrenceRepository.create.mockResolvedValue(occurrence);
    heatMapRepository.upsertFromOccurrence.mockResolvedValue(undefined);
    sendEmergencyNotificationUseCase.execute.mockRejectedValue(
      new Error("notification failed"),
    );

    await expect(
      new CreateOccurrenceUseCase(
        occurrenceRepository as never,
        sendEmergencyNotificationUseCase as never,
        heatMapRepository as never,
      ).execute(occurrence),
    ).resolves.toEqual(occurrence);
    await Promise.resolve();
    await Promise.resolve();

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to send emergency notifications"),
      expect.any(String),
    );
  });

  it("returns all occurrences", async () => {
    occurrenceRepository.findAll.mockResolvedValue([occurrence]);

    await expect(
      new GetOccurrenceUseCase(occurrenceRepository as never).execute(),
    ).resolves.toEqual([occurrence]);
    expect(occurrenceRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
