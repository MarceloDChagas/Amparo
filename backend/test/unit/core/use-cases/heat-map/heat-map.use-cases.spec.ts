import { Logger } from "@nestjs/common";

import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";
import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { CalculateHeatMapUseCase } from "@/core/use-cases/heat-map/calculate-heat-map.use-case";
import { GetHeatMapUseCase } from "@/core/use-cases/heat-map/get-heat-map.use-case";

// Valida o cálculo do mapa de calor (agrupamento em células e risco) e a leitura das células.
describe("Heat map use cases", () => {
  const heatMapRepository = {
    findAll: jest.fn(),
    replaceAll: jest.fn(),
    upsertFromOccurrence: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Garante que sem ocorrências o mapa de calor é zerado (replaceAll com lista vazia).
  it("clears the heat map when there are no occurrences", async () => {
    heatMapRepository.replaceAll.mockResolvedValue(undefined);

    await new CalculateHeatMapUseCase(heatMapRepository).execute([]);

    expect(heatMapRepository.replaceAll).toHaveBeenCalledWith([]);
  });

  // Garante o agrupamento por célula, o peso extra de agressor identificado e o descarte de ocorrência sem coordenada.
  it("groups occurrences by cell and weights identified aggressors", async () => {
    const older = new Date("2026-01-01T10:00:00.000Z");
    const newer = new Date("2026-01-02T10:00:00.000Z");
    const occurrences = [
      new Occurrence({
        id: "occurrence-1",
        description: "Primeira",
        latitude: -8.331,
        longitude: -36.421,
        userId: "user-1",
        createdAt: older,
      }),
      new Occurrence({
        id: "occurrence-2",
        description: "Segunda",
        latitude: -8.332,
        longitude: -36.422,
        userId: "user-1",
        aggressorId: "aggressor-1",
        createdAt: newer,
      }),
      new Occurrence({
        id: "occurrence-ignored",
        description: "Sem coordenada",
        latitude: null as never,
        longitude: -36.422,
        userId: "user-1",
      }),
    ];
    heatMapRepository.replaceAll.mockResolvedValue(undefined);

    await new CalculateHeatMapUseCase(heatMapRepository).execute(occurrences);

    const [[cells]] = heatMapRepository.replaceAll.mock.calls as [
      [HeatMapCell[]],
    ];
    expect(cells).toHaveLength(1);
    expect(cells[0].cellKey).toBe("-8.34_-36.43");
    expect(cells[0].latitude).toBeCloseTo(-8.335);
    expect(cells[0].longitude).toBeCloseTo(-36.425);
    expect(cells[0].intensity).toBe(2);
    expect(cells[0].riskScore).toBe(2.5);
    expect(cells[0].lastOccurrence).toBe(newer);
  });

  // Garante que a leitura retorna todas as células do mapa de calor.
  it("returns all heat map cells", async () => {
    const cells = [new HeatMapCell({ cellKey: "1_1" } as HeatMapCell)];
    heatMapRepository.findAll.mockResolvedValue(cells);

    await expect(
      new GetHeatMapUseCase(heatMapRepository).execute(),
    ).resolves.toEqual(cells);
    expect(heatMapRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
