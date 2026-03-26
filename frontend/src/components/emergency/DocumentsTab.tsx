"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/presentation/hooks/useAuth";
import { Document, documentService } from "@/services/document-service";

export function DocumentsTab() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const docs = await documentService.listByUserId(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar documentos.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      void loadDocuments();
    }
  }, [user?.id, loadDocuments]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      // 1. Get presigned URL
      const { url, key } = await documentService.getUploadUrl(
        file.name,
        file.type,
        user.id,
      );

      // 2. Upload to MinIO
      await documentService.uploadFileDirect(url, file);

      // 3. Confirm metadata
      await documentService.confirmUpload({
        fileName: file.name,
        contentType: file.type,
        storageKey: key,
        sizeBytes: file.size,
        userId: user.id,
      });

      toast.success("Documento enviado com sucesso!");
      void loadDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar documento.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDownload(doc: Document) {
    try {
      const url = await documentService.getDownloadUrl(doc.storageKey);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao abrir documento.");
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Tem certeza que deseja remover este documento?")) return;

    try {
      await documentService.delete(docId);
      toast.success("Documento removido.");
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover documento.");
    }
  }

  function formatBytes(bytes: number | null): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto relative px-4 mt-2 mb-20"
    >
      <div
        className="mb-4 w-full rounded-2xl p-4"
        style={{
          border: "1px solid rgba(180,140,160,0.25)",
          backgroundColor: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: "#3a2530" }}>
          Documentos
        </h3>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: "#7a5565" }}
        >
          Reúna documentos, comprovantes e anotações importantes para manter o
          histórico do seu acompanhamento sempre acessível.
        </p>
        <Link
          href="/app/notes"
          className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4"
          style={{
            color: "#c4705a",
            textDecorationColor: "rgba(196,112,90,0.4)",
          }}
        >
          Abrir minhas notas
        </Link>
      </div>

      {/* Upload trigger card — acessível por teclado (NRF10) */}
      <div
        role="button"
        tabIndex={0}
        aria-label={uploading ? "Enviando arquivo..." : "Adicionar documento"}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className="w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:outline-none"
        style={{
          border: "1px solid rgba(196,112,90,0.20)",
          backgroundColor: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(196,112,90,0.12)" }}
        >
          {uploading ? (
            <Loader2
              className="h-7 w-7 animate-spin"
              style={{ color: "#c4705a" }}
            />
          ) : (
            <Upload className="h-7 w-7" style={{ color: "#c4705a" }} />
          )}
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg" style={{ color: "#3a2530" }}>
            {uploading ? "Enviando arquivo..." : "Adicionar documento"}
          </h3>
          <p className="text-sm" style={{ color: "#7a5565" }}>
            Envie evidências, laudos, comprovantes ou PDFs relevantes
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf"
        />
      </div>

      <div className="w-full mt-6 space-y-4">
        <h4 className="px-1 font-medium" style={{ color: "#3a2530" }}>
          Seus documentos
        </h4>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: "rgba(196,112,90,0.5)" }}
            />
          </div>
        ) : documents.length === 0 ? (
          <div
            className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
            style={{
              border: "1px solid rgba(180,140,160,0.20)",
              backgroundColor: "rgba(255,255,255,0.40)",
            }}
          >
            <FileText
              className="h-10 w-10 mb-2"
              style={{ color: "rgba(180,140,160,0.50)" }}
            />
            <p className="text-sm font-medium" style={{ color: "#7a5565" }}>
              Nenhum documento ainda
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(122,85,101,0.60)" }}
            >
              Use o botão acima para enviar evidências, laudos ou comprovantes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{
                  border: "1px solid rgba(180,140,160,0.22)",
                  backgroundColor: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => void handleDownload(doc)}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(196,112,90,0.10)" }}
                  >
                    <FileText
                      className="h-5 w-5"
                      style={{ color: "#c4705a" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: "#3a2530" }}
                    >
                      {doc.fileName}
                    </p>
                    <p className="text-xs" style={{ color: "#7a5565" }}>
                      {formatBytes(doc.sizeBytes)} -{" "}
                      {format(new Date(doc.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => void handleDownload(doc)}
                    className="p-2 transition-colors"
                    style={{ color: "#7a5565" }}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(doc.id)}
                    className="p-2 transition-colors"
                    style={{ color: "rgba(122,85,101,0.55)" }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
