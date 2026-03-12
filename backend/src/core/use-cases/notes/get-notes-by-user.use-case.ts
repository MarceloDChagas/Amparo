import { Inject, Injectable } from "@nestjs/common";

import { Note } from "@/core/domain/entities/note.entity";
import { NoteRepository } from "@/core/domain/repositories/note-repository";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";

export interface GetNotesByUserRequest {
  userId: string;
}

@Injectable()
export class GetNotesByUserUseCase {
  constructor(
    @Inject("NoteRepository")
    private readonly noteRepository: NoteRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: GetNotesByUserRequest): Promise<Note[]> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await this.noteRepository.findByUserId(request.userId);
  }
}
