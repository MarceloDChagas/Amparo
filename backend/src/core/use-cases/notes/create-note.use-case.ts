import { Inject, Injectable } from "@nestjs/common";

import { Note } from "@/core/domain/entities/note.entity";
import { NoteRepository } from "@/core/domain/repositories/note-repository";
import { UserRepository } from "@/core/domain/repositories/user.repository";

export interface CreateNoteRequest {
  title?: string;
  content: string;
  userId: string;
  occurrenceId?: string;
}

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject("NoteRepository")
    private readonly noteRepository: NoteRepository,
    @Inject("UserRepository")
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateNoteRequest): Promise<Note> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const note = new Note({
      title: request.title || null,
      content: request.content,
      userId: request.userId,
      occurrenceId: request.occurrenceId || null,
    });

    return await this.noteRepository.create(note);
  }
}
