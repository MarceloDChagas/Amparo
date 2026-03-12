import { Inject, Injectable } from "@nestjs/common";

import { Document } from "@/core/domain/entities/document.entity";
import { DocumentRepository } from "@/core/domain/repositories/document-repository";
import { DOCUMENT_REPOSITORY } from "@/core/ports/document-repository.ports";

export interface ListDocumentsRequest {
  userId: string;
}

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(request: ListDocumentsRequest): Promise<Document[]> {
    return this.documentRepository.findByUserId(request.userId);
  }
}
