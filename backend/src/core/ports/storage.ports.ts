export interface StoragePort {
  deleteObject(key: string): Promise<void>;
}

export const STORAGE_PORT = Symbol("StoragePort");
