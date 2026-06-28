import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { UpdateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/update-emergency-contact.use-case";

// Valida a atualização de um contato de emergência.
describe("UpdateEmergencyContactUseCase", () => {
  let useCase: UpdateEmergencyContactUseCase;

  const mockEmergencyContactRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEmergencyContactUseCase,
        {
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateEmergencyContactUseCase>(
      UpdateEmergencyContactUseCase,
    );
  });

  // Garante que atualizar repassa id e dados parciais ao repositório e devolve o contato atualizado.
  it("should update an emergency contact", async () => {
    const updatedContact = new EmergencyContact({
      id: "contact-id",
      name: "Maria Silva Updated",
      phone: "11999999999",
      email: "maria.updated@example.com",
      relationship: "Mãe",
      priority: 1,
      userId: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updateData = {
      name: "Maria Silva Updated",
      phone: "11999999999",
      email: "maria.updated@example.com",
    };

    mockEmergencyContactRepository.update.mockResolvedValue(updatedContact);

    const result = await useCase.execute("contact-id", updateData);

    expect(mockEmergencyContactRepository.update).toHaveBeenCalledWith(
      "contact-id",
      updateData,
    );
    expect(result).toEqual(updatedContact);
  });
});
