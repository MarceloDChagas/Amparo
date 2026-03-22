"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Note, noteService } from "@/services/note-service";

interface NotesSectionProps {
  userId: string;
}

export function NotesSection({ userId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [userId]);

  async function loadNotes() {
    try {
      const data = await noteService.getByUserId(userId);
      setNotes(data);
    } catch (error) {
      toast.error("Erro ao carregar as notas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote() {
    if (!newNoteContent.trim()) {
      toast.error("A nota não pode estar vazia.");
      return;
    }
    setIsSubmitting(true);
    try {
      await noteService.create({ content: newNoteContent, userId });
      toast.success("Nota salva.");
      setNewNoteContent("");
      loadNotes();
    } catch (error) {
      toast.error("Erro ao salvar nota.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de nova nota */}
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-white">Nova nota</p>
        <textarea
          placeholder="Escreva uma observação, data, nome ou qualquer detalhe importante..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full resize-none rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
        />
        <button
          onClick={handleAddNote}
          disabled={isSubmitting || !newNoteContent.trim()}
          className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isSubmitting ? "Salvando..." : "Salvar nota"}
        </button>
      </div>

      {/* Lista de notas */}
      <div className="space-y-3">
        <h4 className="px-1 text-sm font-medium text-white/70">
          Histórico de notas
        </h4>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <FileText className="h-10 w-10 text-white/20 mb-2" />
            <p className="text-white/40 text-sm">Nenhuma nota registrada.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 space-y-1"
            >
              <p className="text-xs text-white/40">
                {format(
                  new Date(note.createdAt),
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  { locale: ptBR },
                )}
              </p>
              <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
