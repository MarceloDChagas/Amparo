/**
 * RF16 — Geração de Relatórios Oficiais (MEDIUM)
 * Serviço para download de relatórios em PDF gerados pelo backend.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function downloadPdf(url: string, filename: string): Promise<void> {
  const response = await fetch(url, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error("Falha ao gerar relatório");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

export const reportService = {
  async downloadOccurrencesReport(from?: string, to?: string): Promise<void> {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    await downloadPdf(
      `${API_URL}/reports/occurrences${query}`,
      `relatorio-ocorrencias-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  },

  async downloadAreaAnalysisReport(): Promise<void> {
    await downloadPdf(
      `${API_URL}/reports/area-analysis`,
      `relatorio-analise-area-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  },
};
