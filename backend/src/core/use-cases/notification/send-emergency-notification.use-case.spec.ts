import { Test, TestingModule } from "@nestjs/testing";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { Occurrence } from "@/core/domain/entities/occurrence.entity";

import { SendEmergencyNotificationUseCase } from "./send-emergency-notification.use-case";

describe("SendEmergencyNotificationUseCase", () => {
  let useCase: SendEmergencyNotificationUseCase;

  const mockEmergencyContactRepository = {
    findByUserId: jest.fn(),
  };

  const mockEmailService = {
    sendEmergencyNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmergencyNotificationUseCase,
        {
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
        {
          provide: "IEmailService",
          useValue: mockEmailService,
        },
      ],
    }).compile();

    useCase = module.get<SendEmergencyNotificationUseCase>(
      SendEmergencyNotificationUseCase,
    );

    jest.clearAllMocks();
  });

  it("should send notifications to all contacts with email addresses", async () => {
    const userId = "user-1";
    const occurrence = new Occurrence({
      id: "occurrence-1",
      description: "Test emergency",
      latitude: -23.5505,
      longitude: -46.6333,
      userId,
      aggressorId: "aggressor-1",
    });

    const contacts = [
      new EmergencyContact({
        id: "contact-1",
        name: "Contact 1",
        phone: "11987654321",
        email: "contact1@example.com",
        relationship: "Mother",
        priority: 1,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new EmergencyContact({
        id: "contact-2",
        name: "Contact 2",
        phone: "11987654322",
        email: "contact2@example.com",
        relationship: "Father",
        priority: 2,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockEmergencyContactRepository.findByUserId.mockResolvedValue(contacts);
    mockEmailService.sendEmergencyNotification.mockResolvedValue(undefined);

    const result = await useCase.execute(userId, occurrence);

    expect(result).toEqual({
      totalContacts: 2,
      emailsSent: 2,
      emailsFailed: 0,
    });
    expect(mockEmergencyContactRepository.findByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockEmailService.sendEmergencyNotification).toHaveBeenCalledTimes(2);
  });

  it("should skip contacts without email addresses", async () => {
    const userId = "user-1";
    const occurrence = new Occurrence({
      id: "occurrence-1",
      description: "Test emergency",
      latitude: -23.5505,
      longitude: -46.6333,
      userId,
      aggressorId: "aggressor-1",
    });

    const contacts = [
      new EmergencyContact({
        id: "contact-1",
        name: "Contact 1",
        phone: "11987654321",
        email: "contact1@example.com",
        relationship: "Mother",
        priority: 1,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new EmergencyContact({
        id: "contact-2",
        name: "Contact 2",
        phone: "11987654322",
        email: undefined, // No email
        relationship: "Father",
        priority: 2,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockEmergencyContactRepository.findByUserId.mockResolvedValue(contacts);
    mockEmailService.sendEmergencyNotification.mockResolvedValue(undefined);

    const result = await useCase.execute(userId, occurrence);

    expect(result).toEqual({
      totalContacts: 2,
      emailsSent: 1,
      emailsFailed: 0,
    });
    expect(mockEmailService.sendEmergencyNotification).toHaveBeenCalledTimes(1);
  });

  it("should handle email sending failures gracefully", async () => {
    const userId = "user-1";
    const occurrence = new Occurrence({
      id: "occurrence-1",
      description: "Test emergency",
      latitude: -23.5505,
      longitude: -46.6333,
      userId,
      aggressorId: "aggressor-1",
    });

    const contacts = [
      new EmergencyContact({
        id: "contact-1",
        name: "Contact 1",
        phone: "11987654321",
        email: "contact1@example.com",
        relationship: "Mother",
        priority: 1,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new EmergencyContact({
        id: "contact-2",
        name: "Contact 2",
        phone: "11987654322",
        email: "contact2@example.com",
        relationship: "Father",
        priority: 2,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockEmergencyContactRepository.findByUserId.mockResolvedValue(contacts);
    mockEmailService.sendEmergencyNotification
      .mockResolvedValueOnce(undefined) // First email succeeds
      .mockRejectedValueOnce(new Error("SMTP error")); // Second email fails

    const result = await useCase.execute(userId, occurrence);

    expect(result).toEqual({
      totalContacts: 2,
      emailsSent: 1,
      emailsFailed: 1,
    });
  });

  it("should return zeros when no contacts are found", async () => {
    const userId = "user-1";
    const occurrence = new Occurrence({
      id: "occurrence-1",
      description: "Test emergency",
      latitude: -23.5505,
      longitude: -46.6333,
      userId,
      aggressorId: "aggressor-1",
    });

    mockEmergencyContactRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute(userId, occurrence);

    expect(result).toEqual({
      totalContacts: 0,
      emailsSent: 0,
      emailsFailed: 0,
    });
    expect(mockEmailService.sendEmergencyNotification).not.toHaveBeenCalled();
  });
});
