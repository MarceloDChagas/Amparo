import { Test, TestingModule } from "@nestjs/testing";

import { User } from "@/core/domain/entities/user.entity";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";
import { UpdateUserUseCase } from "@/core/use-cases/user/update-user.use-case";

// Valida a atualização dos dados de um usuário.
describe("UpdateUserUseCase", () => {
  let useCase: UpdateUserUseCase;

  const mockUserRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  // Garante que atualizar repassa id e dados ao repositório e devolve o usuário atualizado.
  it("should update a user successfully", async () => {
    const userId = "1";
    const userData: Partial<User> = { name: "Updated Name" };
    const updatedUser = { id: userId, ...userData } as User;

    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, userData);

    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userData);
  });
});
