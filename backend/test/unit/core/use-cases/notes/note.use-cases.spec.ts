import { Note } from "@/core/domain/entities/note.entity";
import { CreateNoteUseCase } from "@/core/use-cases/notes/create-note.use-case";
import { GetNotesByUserUseCase } from "@/core/use-cases/notes/get-notes-by-user.use-case";

// Valida os casos de uso de anotações (criar e listar por usuário).
describe("Note use cases", () => {
  const noteRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
  };

  const userRepository = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Garante que não cria anotação para usuário inexistente.
  it("throws when creating a note for a missing user", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      new CreateNoteUseCase(
        noteRepository as never,
        userRepository as never,
      ).execute({
        content: "Registro seguro",
        userId: "missing-user",
      }),
    ).rejects.toThrow("User not found");
    expect(noteRepository.create).not.toHaveBeenCalled();
  });

  // Garante que campos opcionais ausentes (título, ocorrência) ficam como null.
  it("creates a note with nullable optional fields", async () => {
    userRepository.findById.mockResolvedValue({ id: "user-1" });
    noteRepository.create.mockImplementation(async (note: Note) => note);

    const result = await new CreateNoteUseCase(
      noteRepository as never,
      userRepository as never,
    ).execute({
      content: "Registro seguro",
      userId: "user-1",
    });

    expect(result).toEqual(
      expect.objectContaining({
        title: null,
        content: "Registro seguro",
        userId: "user-1",
        occurrenceId: null,
      }),
    );
    expect(noteRepository.create).toHaveBeenCalledWith(expect.any(Note));
  });

  // Garante que não lista anotações de usuário inexistente.
  it("throws when listing notes for a missing user", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      new GetNotesByUserUseCase(
        noteRepository as never,
        userRepository as never,
      ).execute({ userId: "missing-user" }),
    ).rejects.toThrow("User not found");
    expect(noteRepository.findByUserId).not.toHaveBeenCalled();
  });

  // Garante que a listagem retorna as anotações do usuário informado.
  it("lists notes by user", async () => {
    const notes = [{ id: "note-1" }];
    userRepository.findById.mockResolvedValue({ id: "user-1" });
    noteRepository.findByUserId.mockResolvedValue(notes);

    await expect(
      new GetNotesByUserUseCase(
        noteRepository as never,
        userRepository as never,
      ).execute({ userId: "user-1" }),
    ).resolves.toEqual(notes);
    expect(noteRepository.findByUserId).toHaveBeenCalledWith("user-1");
  });
});
