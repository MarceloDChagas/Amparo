"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Document, documentService } from "@/services/document-service";

interface DocumentsSectionProps {
  userId: string;
}

export function DocumentsSection({ userId }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadDocuments();
  }, [userId]);

  async function loadDocuments() {
    try {
      const data = await documentService.listByUserId(userId);
      setDocuments(data);
    } catch (error) {
      toast.error("Erro ao carregar documentos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    setIsUploading(true);
    try {
      // 1. Obter presigned URL do backend
      const { url, key } = await documentService.getUploadUrl(
        file.name,
        file.type,
        userId,
      );

      // 2. Fazer PUT direto para o MinIO
      await documentService.uploadFileDirect(url, file);

      // 3. Confirmar metadados no banco
      await documentService.confirmUpload({
        fileName: file.name,
        contentType: file.type,
        storageKey: key,
        sizeBytes: file.size,
        userId,
      });

      toast.success("Documento anexado com sucesso.");
      void loadDocuments();
    } catch (error) {
      toast.error("Erro ao anexar documento.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDownload(doc: Document) {
    try {
      const url = await documentService.getDownloadUrl(doc.storageKey);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Erro ao obter link de download.");
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;

    try {
      await documentService.delete(id);
      toast.success("Documento excluído com sucesso.");
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      toast.error("Erro ao excluir documento.");
      console.error(error);
    }
  }

  function formatBytes(bytes: number | null): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>Documentos</CardTitle>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Enviando..." : "Anexar Documento"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => void handleFileChange(e)}
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">
              Carregando documentos...
            </p>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum documento anexado a este usuário.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.sizeBytes)} &middot;{" "}
                        {format(
                          new Date(doc.createdAt),
                          "dd 'de' MMM 'de' yyyy",
                          { locale: ptBR },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleDownload(doc)}
                      title="Baixar documento"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleDelete(doc.id)}
                      title="Excluir documento"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
