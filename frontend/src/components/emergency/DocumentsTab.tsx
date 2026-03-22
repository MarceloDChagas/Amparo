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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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
    try {
      await documentService.delete(docId);
      toast.success("Documento removido.");
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover documento.");
    } finally {
      setConfirmDeleteId(null);
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
      <div className="mb-4 w-full rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
        <h3 className="text-base font-semibold text-white">Registros</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          Documentos, comprovantes e evidências do seu caso.
        </p>
        <Link
          href="/app/notes"
          className="mt-3 inline-flex text-sm font-semibold text-white underline decoration-white/30 underline-offset-4"
        >
          Abrir minhas notas
        </Link>
      </div>

      {/* Upload trigger card */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/15 transition-all active:scale-[0.98]"
      >
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          {uploading ? (
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          ) : (
            <Upload className="h-7 w-7 text-white" />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg">
            {uploading ? "Enviando arquivo..." : "Adicionar documento"}
          </h3>
          <p className="text-white/60 text-sm">
            Envie evidências, laudos, comprovantes ou PDFs relevantes
          </p>
          {!uploading && (
            <p className="text-white/40 text-xs mt-1">
              Imagens e PDFs · máx. 50 MB
            </p>
          )}
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
        <h4 className="px-1 font-medium text-white/90">Seus documentos</h4>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <FileText className="h-10 w-10 text-white/20 mb-2" />
            <p className="text-white/40 text-sm">
              Nenhum documento encontrado.
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
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between group"
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => void handleDownload(doc)}
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-white/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-white/40 text-xs">
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
                    aria-label="Baixar documento"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {confirmDeleteId === doc.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => void handleDelete(doc.id)}
                        className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remover
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(doc.id)}
                      aria-label="Remover documento"
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
