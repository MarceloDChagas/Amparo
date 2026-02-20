import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";

import { GetEmergencyContactUseCase } from "./get-emergency-contact.use-case";

describe("GetEmergencyContactUseCase", () => {
  let useCase: GetEmergencyContactUseCase;

  const mockEmergencyContactRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEmergencyContactUseCase,
        {
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetEmergencyContactUseCase>(
      GetEmergencyContactUseCase,
    );
  });

  it("should get an emergency contact by id", async () => {
    const contact = new EmergencyContact({
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

    mockEmergencyContactRepository.findById.mockResolvedValue(contact);

    const result = await useCase.execute("contact-id");

    expect(mockEmergencyContactRepository.findById).toHaveBeenCalledWith(
      "contact-id",
    );
    expect(result).toEqual(contact);
  });

  it("should return null if contact not found", async () => {
    mockEmergencyContactRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("non-existent-id");

    expect(mockEmergencyContactRepository.findById).toHaveBeenCalledWith(
      "non-existent-id",
    );
    expect(result).toBeNull();
  });

  it("should get all emergency contacts", async () => {
    const contacts = [
      new EmergencyContact({
        id: "contact-1",
        name: "Maria Silva",
        phone: "11987654321",
        relationship: "Mãe",
        priority: 1,
        userId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new EmergencyContact({
        id: "contact-2",
        name: "João Santos",
        phone: "11987654322",
        relationship: "Amigo",
        priority: 2,
        userId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockEmergencyContactRepository.findAll.mockResolvedValue(contacts);

    const result = await useCase.executeFindAll();

    expect(mockEmergencyContactRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(contacts);
  });

  it("should get emergency contacts by user id", async () => {
    const contacts = [
      new EmergencyContact({
        id: "contact-1",
        name: "Maria Silva",
        phone: "11987654321",
        relationship: "Mãe",
        priority: 1,
        userId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockEmergencyContactRepository.findByUserId.mockResolvedValue(contacts);

    const result = await useCase.executeFindByUserId("user-id");

    expect(mockEmergencyContactRepository.findByUserId).toHaveBeenCalledWith(
      "user-id",
    );
    expect(result).toEqual(contacts);
  });
});
