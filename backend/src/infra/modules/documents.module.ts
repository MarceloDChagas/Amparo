import { Module } from "@nestjs/common";

import { DOCUMENT_REPOSITORY } from "@/core/ports/document-repository.ports";
import { CreateDocumentUseCase } from "@/core/use-cases/documents/create-document.use-case";
import { DeleteDocumentUseCase } from "@/core/use-cases/documents/delete-document.use-case";
import { ListDocumentsUseCase } from "@/core/use-cases/documents/list-documents.use-case";
import { PrismaDocumentRepository } from "@/infra/database/repositories/prisma-document.repository";
import { DocumentsController } from "@/infra/http/controllers/documents.controller";
import { StorageModule } from "@/infra/modules/storage.module";
import { UserModule } from "@/infra/modules/user.module";

@Module({
  imports: [StorageModule, UserModule],
  controllers: [DocumentsController],
  providers: [
    CreateDocumentUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: PrismaDocumentRepository,
    },
  ],
})
export class DocumentsModule {}
