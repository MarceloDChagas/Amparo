export class Document {
  id: string;
  fileName: string;
  contentType: string;
  storageKey: string;
  sizeBytes: number | null;
  userId: string;
  uploadedBy: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: Omit<Document, "id" | "createdAt" | "updatedAt">,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || crypto.randomUUID();
    this.fileName = props.fileName;
    this.contentType = props.contentType;
    this.storageKey = props.storageKey;
    this.sizeBytes = props.sizeBytes;
    this.userId = props.userId;
    this.uploadedBy = props.uploadedBy;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
