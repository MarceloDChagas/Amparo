import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

import { Role } from "@/core/domain/enums/role.enum";
import { CreateNoteUseCase } from "@/core/use-cases/notes/create-note.use-case";
import { GetNotesByUserUseCase } from "@/core/use-cases/notes/get-notes-by-user.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  userId: z.string().uuid(),
  occurrenceId: z.string().uuid().optional(),
});

export class CreateNoteDto extends createZodDto(createNoteSchema) {}

interface AuthenticatedRequest {
  user: {
    id: string;
    role: Role;
  };
}

@Controller("notes")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class NotesController {
  constructor(
    private createNoteUseCase: CreateNoteUseCase,
    private getNotesByUserUseCase: GetNotesByUserUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.VICTIM)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ZodValidationPipe)
  async create(
    @Body() body: CreateNoteDto,
    @Request() request: AuthenticatedRequest,
  ) {
    const { title, content, userId, occurrenceId } = body;
    const authenticatedUser = request.user;

    if (
      authenticatedUser.role === Role.VICTIM &&
      authenticatedUser.id !== userId
    ) {
      throw new ForbiddenException(
        "Você só pode criar notas para o seu próprio usuário.",
      );
    }

    const note = await this.createNoteUseCase.execute({
      title,
      content,
      userId,
      occurrenceId,
    });

    return {
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        userId: note.userId,
        occurrenceId: note.occurrenceId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    };
  }

  @Get("user/:userId")
  @Roles(Role.ADMIN, Role.VICTIM)
  async getByUser(
    @Param("userId") userId: string,
    @Request() request: AuthenticatedRequest,
  ) {
    const authenticatedUser = request.user;

    if (
      authenticatedUser.role === Role.VICTIM &&
      authenticatedUser.id !== userId
    ) {
      throw new ForbiddenException(
        "Você só pode visualizar as suas próprias notas.",
      );
    }

    const notes = await this.getNotesByUserUseCase.execute({ userId });

    return {
      notes: notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        userId: note.userId,
        occurrenceId: note.occurrenceId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
    };
  }
}
