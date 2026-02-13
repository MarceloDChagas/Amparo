import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";

import { CreateEmergencyContactUseCase } from "./create-emergency-contact.use-case";

describe("CreateEmergencyContactUseCase", () => {
  let useCase: CreateEmergencyContactUseCase;

  const mockEmergencyContactRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmergencyContactUseCase,
        {
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateEmergencyContactUseCase>(
      CreateEmergencyContactUseCase,
    );
  });

  it("should create an emergency contact", async () => {
    const contactData = new EmergencyContact({
      id: "contact-id",
      name: "Maria Silva",
      phone: "11987654321",
      email: "maria@example.com",
      relationship: "Mãe",
      priority: 1,
      victimId: "victim-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockEmergencyContactRepository.create.mockResolvedValue(contactData);

    const result = await useCase.execute(contactData);

    expect(mockEmergencyContactRepository.create).toHaveBeenCalledWith(
      contactData,
    );
    expect(result).toEqual(contactData);
  });
});
