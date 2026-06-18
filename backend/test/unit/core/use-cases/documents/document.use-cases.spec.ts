import { Document } from "@/core/domain/entities/document.entity";
import { DocumentNotFoundError } from "@/core/errors/document.errors";
import { CreateDocumentUseCase } from "@/core/use-cases/documents/create-document.use-case";
import { DeleteDocumentUseCase } from "@/core/use-cases/documents/delete-document.use-case";
import { ListDocumentsUseCase } from "@/core/use-cases/documents/list-documents.use-case";

describe("Document use cases", () => {
  const documentRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  const userRepository = {
    findById: jest.fn(),
  };

  const storage = {
    deleteObject: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws when creating a document for a missing user", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      new CreateDocumentUseCase(
        documentRepository as never,
        userRepository as never,
      ).execute({
        fileName: "medida.pdf",
        contentType: "application/pdf",
        storageKey: "documents/medida.pdf",
        userId: "missing-user",
      }),
    ).rejects.toThrow("User not found");
    expect(documentRepository.create).not.toHaveBeenCalled();
  });

  it("creates a document with nullable optional fields", async () => {
    userRepository.findById.mockResolvedValue({ id: "user-1" });
    documentRepository.create.mockImplementation(async (document: Document) => ({
      ...document,
      id: "document-1",
    }));

    const result = await new CreateDocumentUseCase(
      documentRepository as never,
      userRepository as never,
    ).execute({
      fileName: "medida.pdf",
      contentType: "application/pdf",
      storageKey: "documents/medida.pdf",
      userId: "user-1",
    });

    expect(result).toEqual(
      expect.objectContaining({
        fileName: "medida.pdf",
        contentType: "application/pdf",
        storageKey: "documents/medida.pdf",
        sizeBytes: null,
        userId: "user-1",
        uploadedBy: null,
      }),
    );
    expect(documentRepository.create).toHaveBeenCalledWith(
      expect.any(Document),
    );
  });

  it("lists documents by user", async () => {
    const documents = [{ id: "document-1" }];
    documentRepository.findByUserId.mockResolvedValue(documents);

    await expect(
      new ListDocumentsUseCase(documentRepository as never).execute({
        userId: "user-1",
      }),
    ).resolves.toEqual(documents);
    expect(documentRepository.findByUserId).toHaveBeenCalledWith("user-1");
  });

  it("throws when deleting a missing document", async () => {
    documentRepository.findById.mockResolvedValue(null);

    await expect(
      new DeleteDocumentUseCase(
        documentRepository as never,
        storage as never,
      ).execute({ id: "missing-document" }),
    ).rejects.toThrow(DocumentNotFoundError);
    expect(storage.deleteObject).not.toHaveBeenCalled();
    expect(documentRepository.delete).not.toHaveBeenCalled();
  });

  it("deletes storage object before deleting document record", async () => {
    documentRepository.findById.mockResolvedValue({
      id: "document-1",
      storageKey: "documents/medida.pdf",
    });
    storage.deleteObject.mockResolvedValue(undefined);
    documentRepository.delete.mockResolvedValue(undefined);

    await new DeleteDocumentUseCase(
      documentRepository as never,
      storage as never,
    ).execute({ id: "document-1" });

    expect(storage.deleteObject).toHaveBeenCalledWith("documents/medida.pdf");
    expect(documentRepository.delete).toHaveBeenCalledWith("document-1");
  });
});
