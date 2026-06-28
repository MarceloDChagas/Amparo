import { Logger } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";

// Drains the microtask queue until `predicate` holds, so tests wait for the
// fire-and-forget side effects deterministically — regardless of how deep the
// promise chain that logs the error is — instead of guessing how many
// `await Promise.resolve()` ticks are needed.
const flushUntil = async (
  predicate: () => boolean,
  ticks = 50,
): Promise<void> => {
  for (let i = 0; i < ticks && !predicate(); i++) {
    await Promise.resolve();
  }
};

const errorMock = () => Logger.prototype.error as jest.Mock;
const wasLogged = (fragment: string) =>
  errorMock().mock.calls.some((call) => String(call[0]).includes(fragment));

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

  // Garante que cria a ocorrência e dispara os efeitos colaterais (heat map e notificação).
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

    // The side-effect calls are dispatched synchronously inside execute(),
    // so they are observable immediately after it resolves.
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

  // Garante que falha no heat map não derruba a criação (erro é apenas logado).
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
    await flushUntil(() => wasLogged("Falha ao atualizar heat map"));

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      expect.stringContaining("Falha ao atualizar heat map"),
    );
  });

  // Garante que falha no envio de notificações é logada sem rejeitar a criação.
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
    await flushUntil(() => wasLogged("Failed to send emergency notifications"));

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to send emergency notifications"),
      expect.any(String),
    );
  });

  // Garante que a listagem retorna todas as ocorrências.
  it("returns all occurrences", async () => {
    occurrenceRepository.findAll.mockResolvedValue([occurrence]);

    await expect(
      new GetOccurrenceUseCase(occurrenceRepository as never).execute(),
    ).resolves.toEqual([occurrence]);
    expect(occurrenceRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
