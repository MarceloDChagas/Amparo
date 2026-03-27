/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await */
import { Test, TestingModule } from "@nestjs/testing";

import type { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";

import { GeneratePatrolRouteUseCase } from "./generate-patrol-route.use-case";

/**
 * AM-81 — Testar rotas geradas em diferentes cenários de densidade
 */
describe("GeneratePatrolRouteUseCase", () => {
  let useCase: GeneratePatrolRouteUseCase;

  const mockCells: HeatMapCell[] = [
    {
      cellKey: "-8.33_-36.42",
      latitude: -8.33,
      longitude: -36.42,
      intensity: 6,
      riskScore: 7.5,
      lastOccurrence: new Date(),
    },
    {
      cellKey: "-8.34_-36.43",
      latitude: -8.34,
      longitude: -36.43,
      intensity: 4,
      riskScore: 6.0,
      lastOccurrence: new Date(),
    },
    {
      cellKey: "-8.35_-36.44",
      latitude: -8.35,
      longitude: -36.44,
      intensity: 2,
      riskScore: 3.0,
      lastOccurrence: new Date(),
    },
    {
      cellKey: "-8.36_-36.41",
      latitude: -8.36,
      longitude: -36.41,
      intensity: 2,
      riskScore: 2.5,
      lastOccurrence: new Date(),
    },
    {
      cellKey: "-8.37_-36.45",
      latitude: -8.37,
      longitude: -36.45,
      intensity: 1,
      riskScore: 1.5,
      lastOccurrence: new Date(),
    },
  ];

  const mockHeatMapRepo = { findAll: jest.fn().mockResolvedValue(mockCells) };
  const mockPatrolRouteRepo = {
    create: jest.fn().mockImplementation(async (data) => ({
      id: "route-123",
      ...data,
      waypoints: data.waypoints,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    addLog: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratePatrolRouteUseCase,
        { provide: "IHeatMapRepository", useValue: mockHeatMapRepo },
        { provide: "IPatrolRouteRepository", useValue: mockPatrolRouteRepo },
      ],
    }).compile();

    useCase = module.get<GeneratePatrolRouteUseCase>(
      GeneratePatrolRouteUseCase,
    );
  });

  it("deve gerar rota com waypoints ordenados pela lógica Nearest Neighbor", async () => {
    const route = await useCase.execute({
      name: "Rota Centro",
      generatedBy: "admin-id",
      maxWaypoints: 5,
    });

    expect(route.waypoints.length).toBe(5);
    // Primeiro waypoint deve ter o maior riskScore (origem da rota)
    expect(route.waypoints[0].riskScore).toBe(7.5);
    // Todos os waypoints têm order sequencial
    route.waypoints.forEach((wp, idx) => {
      expect(wp.order).toBe(idx + 1);
    });
  });

  it("AM-81: cenário de alta densidade — gera rota com todos os top N pontos", async () => {
    const route = await useCase.execute({
      name: "Rota Alta Densidade",
      generatedBy: "admin-id",
      maxWaypoints: 3, // limita a 3 waypoints
    });

    expect(route.waypoints.length).toBe(3);
    // Apenas os 3 de maior risco
    const risks = route.waypoints.map((wp) => wp.riskScore);
    expect(Math.max(...risks)).toBe(7.5);
  });

  it("AM-82: com posição da viatura, inicia rota a partir da localização informada", async () => {
    const route = await useCase.execute({
      name: "Rota Viatura A",
      generatedBy: "admin-id",
      vehicleLatitude: -8.33, // próximo ao ponto de riskScore 7.5
      vehicleLongitude: -36.42,
    });

    expect(route.waypoints.length).toBeGreaterThan(0);
    // O primeiro waypoint deve ser o mais próximo da viatura
    expect(route.waypoints[0].riskScore).toBe(7.5);
  });

  it("AM-81: cenário de mapa vazio — lança erro adequado", async () => {
    mockHeatMapRepo.findAll.mockResolvedValueOnce([]);

    await expect(
      useCase.execute({ name: "Rota Vazia", generatedBy: "admin-id" }),
    ).rejects.toThrow("mapa de calor");
  });

  it("AM-81: cenário de baixa densidade — gera rota com células disponíveis", async () => {
    mockHeatMapRepo.findAll.mockResolvedValueOnce([mockCells[0]]);

    const route = await useCase.execute({
      name: "Rota Baixa Densidade",
      generatedBy: "admin-id",
    });

    expect(route.waypoints.length).toBe(1);
    expect(route.waypoints[0].riskScore).toBe(7.5);
  });

  it("AM-84: registra log GENERATED após criar a rota", async () => {
    await useCase.execute({ name: "Rota Log", generatedBy: "admin-id" });

    expect(mockPatrolRouteRepo.addLog).toHaveBeenCalledWith(
      "route-123",
      "GENERATED",
      expect.objectContaining({ performedBy: "admin-id" }),
    );
  });

  it("AM-84: registra log ASSIGNED quando assignedTo é informado", async () => {
    await useCase.execute({
      name: "Rota Assign",
      generatedBy: "admin-id",
      assignedTo: "agent-456",
    });

    expect(mockPatrolRouteRepo.addLog).toHaveBeenCalledWith(
      "route-123",
      "ASSIGNED",
      expect.objectContaining({ metadata: { agentId: "agent-456" } }),
    );
  });
});
