import { Document } from "@/core/domain/entities/document.entity";

export interface DocumentRepository {
  create(document: Document): Promise<Document>;
  findByUserId(userId: string): Promise<Document[]>;
  findById(id: string): Promise<Document | null>;
  delete(id: string): Promise<void>;
}
