const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface Note {
  id: string;
  title: string | null;
  content: string;
  userId: string;
  occurrenceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title?: string;
  content: string;
  userId: string;
  occurrenceId?: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const noteService = {
  async getByUserId(userId: string): Promise<Note[]> {
    const response = await fetch(`${API_URL}/notes/user/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    const data = await response.json();
    return data.notes;
  },

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    const responseData = await response.json();
    return responseData.note;
  },
};
