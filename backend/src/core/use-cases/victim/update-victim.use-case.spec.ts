import { Test, TestingModule } from "@nestjs/testing";

import { User } from "@/core/domain/entities/user.entity";

import { UpdateVictimUseCase } from "./update-victim.use-case";

describe("UpdateVictimUseCase", () => {
  let useCase: UpdateVictimUseCase;

  const mockUserRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVictimUseCase,
        {
          provide: "UserRepository",
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateVictimUseCase>(UpdateVictimUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should update a user (victim) successfully", async () => {
    const userId = "1";
    const userData: Partial<User> = { name: "Updated Name" };
    const updatedUser = { id: userId, ...userData } as User;

    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, userData);

    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userData);
  });
});
