import { Inject, Injectable } from "@nestjs/common";

import { DocumentRepository } from "@/core/domain/repositories/document-repository";
import { DocumentNotFoundError } from "@/core/errors/document.errors";
import { DOCUMENT_REPOSITORY } from "@/core/ports/document-repository.ports";
import { STORAGE_PORT, StoragePort } from "@/core/ports/storage.ports";

export interface DeleteDocumentRequest {
  id: string;
}

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
    @Inject(STORAGE_PORT)
    private readonly documentStorage: StoragePort,
  ) {}

  async execute(request: DeleteDocumentRequest): Promise<void> {
    const document = await this.documentRepository.findById(request.id);
    if (!document) {
      throw new DocumentNotFoundError();
    }

    await this.documentStorage.deleteObject(document.storageKey);
    await this.documentRepository.delete(request.id);
  }
}
