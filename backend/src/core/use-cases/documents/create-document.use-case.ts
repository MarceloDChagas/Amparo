import { Inject, Injectable } from "@nestjs/common";

import { Document } from "@/core/domain/entities/document.entity";
import { DocumentRepository } from "@/core/domain/repositories/document-repository";
import { UserRepository } from "@/core/domain/repositories/user.repository";

export interface CreateDocumentRequest {
  fileName: string;
  contentType: string;
  storageKey: string;
  sizeBytes?: number;
  userId: string;
  uploadedBy?: string;
}

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    @Inject("DocumentRepository")
    private readonly documentRepository: DocumentRepository,
    @Inject("UserRepository")
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateDocumentRequest): Promise<Document> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const document = new Document({
      fileName: request.fileName,
      contentType: request.contentType,
      storageKey: request.storageKey,
      sizeBytes: request.sizeBytes ?? null,
      userId: request.userId,
      uploadedBy: request.uploadedBy ?? null,
    });

    return this.documentRepository.create(document);
  }
}
