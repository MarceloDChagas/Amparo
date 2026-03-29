const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  createdAt: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const auditLogService = {
  async getRecent(limit = 5): Promise<AuditLog[]> {
    const response = await fetch(
      `${API_URL}/audit-logs/recent?limit=${limit}`,
      { headers: getAuthHeaders() },
    );
    if (!response.ok) throw new Error("Failed to fetch recent audit logs");
    return response.json();
  },
};
