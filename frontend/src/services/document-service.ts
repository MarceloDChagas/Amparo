const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface Document {
  id: string;
  fileName: string;
  contentType: string;
  storageKey: string;
  sizeBytes: number | null;
  userId: string;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

function getJsonHeaders() {
  return {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };
}

export const documentService = {
  async getUploadUrl(
    fileName: string,
    contentType: string,
    userId: string,
  ): Promise<{ url: string; key: string }> {
    const response = await fetch(`${API_URL}/storage/upload-url`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify({ fileName, contentType, userId }),
    });
    if (!response.ok) throw new Error("Falha ao obter URL de upload");
    return response.json() as Promise<{ url: string; key: string }>;
  },

  async uploadFileDirect(url: string, file: File): Promise<void> {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) throw new Error("Falha ao enviar arquivo para o storage");
  },

  async confirmUpload(payload: {
    fileName: string;
    contentType: string;
    storageKey: string;
    sizeBytes?: number;
    userId: string;
  }): Promise<Document> {
    const response = await fetch(`${API_URL}/documents`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Falha ao confirmar upload");
    const data = (await response.json()) as { document: Document };
    return data.document;
  },

  async getDownloadUrl(key: string): Promise<string> {
    const response = await fetch(
      `${API_URL}/storage/download-url?key=${encodeURIComponent(key)}`,
      { headers: getAuthHeaders() },
    );
    if (!response.ok) throw new Error("Falha ao obter URL de download");
    const data = (await response.json()) as { url: string };
    return data.url;
  },

  async listByUserId(userId: string): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao carregar documentos");
    const data = (await response.json()) as { documents: Document[] };
    return data.documents;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao excluir documento");
  },
};
