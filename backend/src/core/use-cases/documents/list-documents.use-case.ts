import { Inject, Injectable } from "@nestjs/common";

import { Document } from "@/core/domain/entities/document.entity";
import { DocumentRepository } from "@/core/domain/repositories/document-repository";

export interface ListDocumentsRequest {
  userId: string;
}

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject("DocumentRepository")
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(request: ListDocumentsRequest): Promise<Document[]> {
    return this.documentRepository.findByUserId(request.userId);
  }
}
