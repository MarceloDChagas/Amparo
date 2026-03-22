import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

import { Role } from "@/core/domain/enums/role.enum";
import { DocumentNotFoundError } from "@/core/errors/document.errors";
import { CreateDocumentUseCase } from "@/core/use-cases/documents/create-document.use-case";
import { DeleteDocumentUseCase } from "@/core/use-cases/documents/delete-document.use-case";
import { ListDocumentsUseCase } from "@/core/use-cases/documents/list-documents.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

const createDocumentSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  storageKey: z.string().min(1),
  sizeBytes: z.number().int().positive().optional(),
  userId: z.string().uuid(),
  uploadedBy: z.string().uuid().optional(),
});

export class CreateDocumentDto extends createZodDto(createDocumentSchema) {}

@Controller("documents")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class DocumentsController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
  ) {}

  /**
   * POST /documents
   * Registra os metadados de um documento após upload bem-sucedido para o MinIO.
   */
  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ZodValidationPipe)
  async create(@Body() body: CreateDocumentDto) {
    const document = await this.createDocumentUseCase.execute(body);
    return { document: this.toResponse(document) };
  }

  /**
   * GET /documents/user/:userId
   * Lista todos os documentos de um usuário.
   */
  @Get("user/:userId")
  @Roles(Role.ADMIN, Role.USER)
  async listByUser(@Param("userId") userId: string) {
    const documents = await this.listDocumentsUseCase.execute({ userId });
    return { documents: documents.map((d) => this.toResponse(d)) };
  }

  /**
   * DELETE /documents/:id
   * Remove o metadado do banco e o arquivo do MinIO.
   */
  @Delete(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    try {
      await this.deleteDocumentUseCase.execute({ id });
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  private toResponse(document: {
    id: string;
    fileName: string;
    contentType: string;
    storageKey: string;
    sizeBytes: number | null;
    userId: string;
    uploadedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: document.id,
      fileName: document.fileName,
      contentType: document.contentType,
      storageKey: document.storageKey,
      sizeBytes: document.sizeBytes,
      userId: document.userId,
      uploadedBy: document.uploadedBy,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
