import { CheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CloseCheckInUseCase } from "@/core/use-cases/close-check-in.use-case";
import { GetActiveCheckInUseCase } from "@/core/use-cases/get-active-check-in.use-case";
import { GetAllActiveCheckInsUseCase } from "@/core/use-cases/get-all-active-check-ins.use-case";
import { GetCheckInByIdUseCase } from "@/core/use-cases/get-check-in-by-id.use-case";
import { GetLateCheckInsUseCase } from "@/core/use-cases/get-late-check-ins.use-case";

// Valida os casos de uso de leitura/fechamento de check-in (fechar, ativos, detalhes, atrasados).
describe("Check-in use-cases (unit)", () => {
  const checkInRepositoryMock = {
    findById: jest.fn(),
    closeByAdmin: jest.fn(),
    findActiveByUserId: jest.fn(),
    findAllActive: jest.fn(),
    findDetailedById: jest.fn(),
    findAllLate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CloseCheckInUseCase", () => {
    // Garante que fechar um check-in inexistente lança erro e não chama closeByAdmin.
    it("throws when check-in does not exist", async () => {
      const useCase = new CloseCheckInUseCase(checkInRepositoryMock as never);
      checkInRepositoryMock.findById.mockResolvedValue(null);

      await expect(useCase.execute("missing-check-in")).rejects.toThrow(
        CheckInNotFoundError,
      );
      expect(checkInRepositoryMock.closeByAdmin).not.toHaveBeenCalled();
    });

    // Garante que fecha o check-in pelo admin quando ele existe.
    it("closes check-in when found", async () => {
      const useCase = new CloseCheckInUseCase(checkInRepositoryMock as never);
      const closed = { id: "check-in-1", status: "CANCELLED" };

      checkInRepositoryMock.findById.mockResolvedValue({ id: "check-in-1" });
      checkInRepositoryMock.closeByAdmin.mockResolvedValue(closed);

      await expect(useCase.execute("check-in-1")).resolves.toEqual(closed);
      expect(checkInRepositoryMock.closeByAdmin).toHaveBeenCalledWith(
        "check-in-1",
      );
    });
  });

  describe("GetActiveCheckInUseCase", () => {
    // Garante que retorna o check-in ativo do usuário.
    it("returns active check-in by user", async () => {
      const useCase = new GetActiveCheckInUseCase(
        checkInRepositoryMock as never,
      );
      const active = { id: "active-1", userId: "user-1", status: "ACTIVE" };

      checkInRepositoryMock.findActiveByUserId.mockResolvedValue(active);

      await expect(useCase.execute("user-1")).resolves.toEqual(active);
      expect(checkInRepositoryMock.findActiveByUserId).toHaveBeenCalledWith(
        "user-1",
      );
    });
  });

  describe("GetAllActiveCheckInsUseCase", () => {
    // Garante que lista todos os check-ins ativos.
    it("returns all active check-ins", async () => {
      const useCase = new GetAllActiveCheckInsUseCase(
        checkInRepositoryMock as never,
      );
      const allActive = [{ id: "active-1" }, { id: "active-2" }];

      checkInRepositoryMock.findAllActive.mockResolvedValue(allActive);

      await expect(useCase.execute()).resolves.toEqual(allActive);
      expect(checkInRepositoryMock.findAllActive).toHaveBeenCalledTimes(1);
    });
  });

  describe("GetCheckInByIdUseCase", () => {
    // Garante que lança erro quando os detalhes do check-in não existem.
    it("throws when check-in details are missing", async () => {
      const useCase = new GetCheckInByIdUseCase(checkInRepositoryMock as never);
      checkInRepositoryMock.findDetailedById.mockResolvedValue(null);

      await expect(useCase.execute("missing-details")).rejects.toThrow(
        CheckInNotFoundError,
      );
    });

    // Garante que retorna os detalhes do check-in quando encontrado.
    it("returns check-in details when found", async () => {
      const useCase = new GetCheckInByIdUseCase(checkInRepositoryMock as never);
      const details = {
        id: "check-in-2",
        userId: "user-2",
        userCheckInCount: 4,
      };

      checkInRepositoryMock.findDetailedById.mockResolvedValue(details);

      await expect(useCase.execute("check-in-2")).resolves.toEqual(details);
      expect(checkInRepositoryMock.findDetailedById).toHaveBeenCalledWith(
        "check-in-2",
      );
    });
  });

  describe("GetLateCheckInsUseCase", () => {
    // Garante que lista todos os check-ins atrasados.
    it("returns all late check-ins", async () => {
      const useCase = new GetLateCheckInsUseCase(
        checkInRepositoryMock as never,
      );
      const late = [{ id: "late-1" }, { id: "late-2" }];

      checkInRepositoryMock.findAllLate.mockResolvedValue(late);

      await expect(useCase.execute()).resolves.toEqual(late);
      expect(checkInRepositoryMock.findAllLate).toHaveBeenCalledTimes(1);
    });
  });
});
