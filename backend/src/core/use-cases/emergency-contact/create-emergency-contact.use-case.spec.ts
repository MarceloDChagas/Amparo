import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";

import { CreateEmergencyContactUseCase } from "./create-emergency-contact.use-case";

describe("CreateEmergencyContactUseCase", () => {
  let useCase: CreateEmergencyContactUseCase;

  const mockEmergencyContactRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
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

    jest.clearAllMocks();
  });

  it("should create an emergency contact when user has less than 3 contacts", async () => {
    const contactData = new EmergencyContact({
      id: "contact-id",
      name: "Maria Silva",
      phone: "11987654321",
      email: "maria@example.com",
      relationship: "Mãe",
      priority: 1,
      userId: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockEmergencyContactRepository.findByUserId.mockResolvedValue([]);
    mockEmergencyContactRepository.create.mockResolvedValue(contactData);

    const result = await useCase.execute(contactData);

    expect(mockEmergencyContactRepository.findByUserId).toHaveBeenCalledWith(
      "user-id",
    );
    expect(mockEmergencyContactRepository.create).toHaveBeenCalledWith(
      contactData,
    );
    expect(result).toEqual(contactData);
  });

  it("should throw BadRequestException when user already has 3 contacts", async () => {
    const contactData = new EmergencyContact({
      id: "contact-id-4",
      name: "João Silva",
      phone: "11987654322",
      email: "joao@example.com",
      relationship: "Pai",
      priority: 4,
      userId: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock 3 existing contacts
    mockEmergencyContactRepository.findByUserId.mockResolvedValue([
      { id: "1" },
      { id: "2" },
      { id: "3" },
    ]);

    await expect(useCase.execute(contactData)).rejects.toThrow(
      BadRequestException,
    );
    await expect(useCase.execute(contactData)).rejects.toThrow(
      "O limite máximo é de 3 contatos de confiança por usuária.",
    );
    expect(mockEmergencyContactRepository.create).not.toHaveBeenCalled();
  });
});
