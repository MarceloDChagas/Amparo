import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { DocumentRepository } from "@/core/domain/repositories/document-repository";
import { StorageService } from "@/infra/services/storage.service";

export interface DeleteDocumentRequest {
  id: string;
}

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject("DocumentRepository")
    private readonly documentRepository: DocumentRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(request: DeleteDocumentRequest): Promise<void> {
    const document = await this.documentRepository.findById(request.id);
    if (!document) {
      throw new NotFoundException("Document not found");
    }

    await this.storageService.deleteObject(document.storageKey);
    await this.documentRepository.delete(request.id);
  }
}
