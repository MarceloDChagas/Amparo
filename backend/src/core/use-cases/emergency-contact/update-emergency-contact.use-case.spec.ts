import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";

import { UpdateEmergencyContactUseCase } from "./update-emergency-contact.use-case";

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

  it("should update an emergency contact", async () => {
    const updatedContact = new EmergencyContact({
      id: "contact-id",
      name: "Maria Silva Updated",
      phone: "11999999999",
      email: "maria.updated@example.com",
      relationship: "Mãe",
      priority: 1,
      victimId: "victim-id",
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
