import { Injectable } from "@nestjs/common";

import { Note } from "@/core/domain/entities/note.entity";
import { NoteRepository } from "@/core/domain/repositories/note-repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaNoteRepository implements NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(note: Note): Promise<Note> {
    const data = await this.prisma.note.create({
      data: {
        id: note.id,
        title: note.title,
        content: note.content,
        userId: note.userId,
        occurrenceId: note.occurrenceId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });

    return new Note(
      {
        title: data.title,
        content: data.content,
        userId: data.userId,
        occurrenceId: data.occurrenceId,
      },
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return notes.map((data) => {
      return new Note(
        {
          title: data.title,
          content: data.content,
          userId: data.userId,
          occurrenceId: data.occurrenceId,
        },
        data.id,
        data.createdAt,
        data.updatedAt,
      );
    });
  }
}
