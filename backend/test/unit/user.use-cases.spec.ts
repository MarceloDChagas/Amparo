import { DeleteUserUseCase } from "@/core/use-cases/user/delete-user.use-case";
import { GetUserUseCase } from "@/core/use-cases/user/get-user.use-case";

describe("User use-cases (unit)", () => {
  const userRepositoryMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
    findById: jest.fn(),
    findByRole: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GetUserUseCase", () => {
    it("returns user by id", async () => {
      const useCase = new GetUserUseCase(userRepositoryMock as never);
      const user = {
        id: "user-1",
        name: "Maria",
        email: "maria@amparo.local",
        role: "USER",
      };

      userRepositoryMock.findById.mockResolvedValue(user);

      await expect(useCase.execute("user-1")).resolves.toEqual(user);
      expect(userRepositoryMock.findById).toHaveBeenCalledWith("user-1");
    });

    it("lists only USER role on executeFindAll", async () => {
      const useCase = new GetUserUseCase(userRepositoryMock as never);
      userRepositoryMock.findByRole.mockResolvedValue([{ id: "user-1" }]);

      await expect(useCase.executeFindAll()).resolves.toEqual([{ id: "user-1" }]);
      expect(userRepositoryMock.findByRole).toHaveBeenCalledWith("USER");
    });
  });

  describe("DeleteUserUseCase", () => {
    it("delegates account deletion to repository", async () => {
      const useCase = new DeleteUserUseCase(userRepositoryMock as never);
      userRepositoryMock.delete.mockResolvedValue(undefined);

      await expect(useCase.execute("user-42")).resolves.toBeUndefined();
      expect(userRepositoryMock.delete).toHaveBeenCalledWith("user-42");
    });
  });
});
