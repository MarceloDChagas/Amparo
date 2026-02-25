import { Note } from "@/core/domain/entities/note.entity";

export interface NoteRepository {
  create(note: Note): Promise<Note>;
  findByUserId(userId: string): Promise<Note[]>;
}
