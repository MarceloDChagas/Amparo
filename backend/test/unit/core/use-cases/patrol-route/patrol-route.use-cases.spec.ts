import { PatrolRoute } from "@/core/domain/entities/patrol-route.entity";
import { AssignPatrolRouteUseCase } from "@/core/use-cases/patrol-route/assign-patrol-route.use-case";
import {
  GetPatrolRouteByIdUseCase,
  PatrolRouteNotFoundError,
} from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";
import { GetPatrolRoutesUseCase } from "@/core/use-cases/patrol-route/get-patrol-routes.use-case";
import { UpdatePatrolRouteStatusUseCase } from "@/core/use-cases/patrol-route/update-patrol-route-status.use-case";

describe("Patrol route use cases", () => {
  const patrolRouteRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByStatus: jest.fn(),
    updateStatus: jest.fn(),
    assignTo: jest.fn(),
    addLog: jest.fn(),
  };

  const makeRoute = (
    overrides: Partial<PatrolRoute> = {},
  ): PatrolRoute =>
    new PatrolRoute({
      id: "route-1",
      name: "Rota Centro",
      waypoints: [{ order: 1, latitude: -8.33, longitude: -36.42, riskScore: 7 }],
      status: "PENDING",
      assignedTo: null,
      generatedBy: "admin-1",
      scheduledAt: null,
      startedAt: null,
      completedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      ...overrides,
    });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2026-06-17T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns all patrol routes", async () => {
    const routes = [makeRoute()];
    patrolRouteRepository.findAll.mockResolvedValue(routes);

    await expect(
      new GetPatrolRoutesUseCase(patrolRouteRepository).execute(),
    ).resolves.toEqual(routes);
    expect(patrolRouteRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("throws when route by id is missing", async () => {
    patrolRouteRepository.findById.mockResolvedValue(null);

    await expect(
      new GetPatrolRouteByIdUseCase(patrolRouteRepository).execute("missing"),
    ).rejects.toThrow(PatrolRouteNotFoundError);
  });

  it("returns route by id", async () => {
    const route = makeRoute();
    patrolRouteRepository.findById.mockResolvedValue(route);

    await expect(
      new GetPatrolRouteByIdUseCase(patrolRouteRepository).execute("route-1"),
    ).resolves.toEqual(route);
    expect(patrolRouteRepository.findById).toHaveBeenCalledWith("route-1");
  });

  it("assigns route and records assignment log", async () => {
    const existing = makeRoute({ assignedTo: "agent-old" });
    const updated = makeRoute({ assignedTo: "agent-new" });
    patrolRouteRepository.findById.mockResolvedValue(existing);
    patrolRouteRepository.assignTo.mockResolvedValue(updated);
    patrolRouteRepository.addLog.mockResolvedValue(undefined);

    await expect(
      new AssignPatrolRouteUseCase(patrolRouteRepository).execute({
        id: "route-1",
        agentId: "agent-new",
        performedBy: "admin-1",
      }),
    ).resolves.toEqual(updated);
    expect(patrolRouteRepository.assignTo).toHaveBeenCalledWith(
      "route-1",
      "agent-new",
    );
    expect(patrolRouteRepository.addLog).toHaveBeenCalledWith(
      "route-1",
      "ASSIGNED",
      {
        performedBy: "admin-1",
        metadata: {
          previousAgent: "agent-old",
          newAgent: "agent-new",
        },
      },
    );
  });

  it("throws when assigning a missing route", async () => {
    patrolRouteRepository.findById.mockResolvedValue(null);

    await expect(
      new AssignPatrolRouteUseCase(patrolRouteRepository).execute({
        id: "missing",
        agentId: "agent-new",
        performedBy: "admin-1",
      }),
    ).rejects.toThrow(PatrolRouteNotFoundError);
    expect(patrolRouteRepository.assignTo).not.toHaveBeenCalled();
  });

  it.each([
    ["IN_PROGRESS", "STARTED", "startedAt"],
    ["COMPLETED", "COMPLETED", "completedAt"],
    ["CANCELLED", "CANCELLED", "completedAt"],
    ["PENDING", "UPDATED", "startedAt"],
  ] as const)(
    "updates status %s and records %s log",
    async (status, event, dateField) => {
      const existing = makeRoute({ status: "PENDING" });
      const updated = makeRoute({ status });
      patrolRouteRepository.findById.mockResolvedValue(existing);
      patrolRouteRepository.updateStatus.mockResolvedValue(updated);
      patrolRouteRepository.addLog.mockResolvedValue(undefined);

      await expect(
        new UpdatePatrolRouteStatusUseCase(patrolRouteRepository).execute({
          id: "route-1",
          status,
          performedBy: "admin-1",
        }),
      ).resolves.toEqual(updated);

      expect(patrolRouteRepository.updateStatus).toHaveBeenCalledWith(
        "route-1",
        expect.objectContaining({
          status,
          [dateField]:
            status === "PENDING" ? undefined : new Date("2026-06-17T12:00:00.000Z"),
        }),
      );
      expect(patrolRouteRepository.addLog).toHaveBeenCalledWith("route-1", event, {
        performedBy: "admin-1",
        metadata: {
          previousStatus: "PENDING",
          newStatus: status,
        },
      });
    },
  );

  it("throws when updating a missing route", async () => {
    patrolRouteRepository.findById.mockResolvedValue(null);

    await expect(
      new UpdatePatrolRouteStatusUseCase(patrolRouteRepository).execute({
        id: "missing",
        status: "IN_PROGRESS",
      }),
    ).rejects.toThrow(PatrolRouteNotFoundError);
    expect(patrolRouteRepository.updateStatus).not.toHaveBeenCalled();
  });
});
