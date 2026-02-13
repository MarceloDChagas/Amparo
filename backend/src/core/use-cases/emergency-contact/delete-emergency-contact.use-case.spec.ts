import { Test, TestingModule } from "@nestjs/testing";

import { DeleteEmergencyContactUseCase } from "./delete-emergency-contact.use-case";

describe("DeleteEmergencyContactUseCase", () => {
  let useCase: DeleteEmergencyContactUseCase;

  const mockEmergencyContactRepository = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEmergencyContactUseCase,
        {
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteEmergencyContactUseCase>(
      DeleteEmergencyContactUseCase,
    );
  });

  it("should delete an emergency contact", async () => {
    await useCase.execute("contact-id");

    expect(mockEmergencyContactRepository.delete).toHaveBeenCalledWith(
      "contact-id",
    );
  });
});
