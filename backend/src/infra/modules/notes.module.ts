import { Module } from "@nestjs/common";

import { CreateNoteUseCase } from "@/core/use-cases/notes/create-note.use-case";
import { GetNotesByUserUseCase } from "@/core/use-cases/notes/get-notes-by-user.use-case";
import { NotesController } from "@/infra/http/controllers/notes.controller";
import { DatabaseModule } from "@/infra/modules/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [CreateNoteUseCase, GetNotesByUserUseCase],
})
export class NotesModule {}
