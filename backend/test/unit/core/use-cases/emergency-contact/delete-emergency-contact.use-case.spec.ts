import { Test, TestingModule } from "@nestjs/testing";

import { DeleteEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/delete-emergency-contact.use-case";

// Valida a remoção de um contato de emergência.
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

  // Garante que remover delega a exclusão ao repositório pelo id.
  it("should delete an emergency contact", async () => {
    await useCase.execute("contact-id");

    expect(mockEmergencyContactRepository.delete).toHaveBeenCalledWith(
      "contact-id",
    );
  });
});
