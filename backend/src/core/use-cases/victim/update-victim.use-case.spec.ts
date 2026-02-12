import { Test, TestingModule } from "@nestjs/testing";

import { Victim } from "@/core/domain/entities/victim.entity";

import { UpdateVictimUseCase } from "./update-victim.use-case";

describe("UpdateVictimUseCase", () => {
  let useCase: UpdateVictimUseCase;

  const mockVictimRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVictimUseCase,
        {
          provide: "IVictimRepository",
          useValue: mockVictimRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateVictimUseCase>(UpdateVictimUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should update a victim successfully", async () => {
    const victimId = "1";
    const victimData: Partial<Victim> = { name: "Updated Name" };
    const updatedVictim = { id: victimId, ...victimData } as Victim;

    mockVictimRepository.update.mockResolvedValue(updatedVictim);

    const result = await useCase.execute(victimId, victimData);

    expect(result).toEqual(updatedVictim);
    expect(mockVictimRepository.update).toHaveBeenCalledWith(
      victimId,
      victimData,
    );
  });

  it("should throw an error if victim is not found", async () => {
    const victimId = "1";
    const victimData: Partial<Victim> = { name: "Updated Name" };

    mockVictimRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(victimId, victimData)).rejects.toThrow(
      "Victim not found",
    );
  });

  it("should throw an error if victim data is invalid", async () => {
    const victimId = "1";
    const victimData: Partial<Victim> = { name: "" };

    await expect(useCase.execute(victimId, victimData)).rejects.toThrow();
  });
});
