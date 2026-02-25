"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
      toast.error("Erro ao carregar as notas deste usuário.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote() {
    if (!newNoteContent.trim()) {
      toast.error("O conteúdo da nota não pode estar vazio.");
      return;
    }

    setIsSubmitting(true);
    try {
      await noteService.create({
        content: newNoteContent,
        userId,
      });
      toast.success("Nota adicionada com sucesso.");
      setNewNoteContent("");
      loadNotes(); // Refresh the list
    } catch (error) {
      toast.error("Erro ao adicionar nota.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escreva uma nova nota sobre este usuário..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />
          <Button onClick={handleAddNote} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Nota"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Histórico de Notas</h3>
        {loading ? (
          <p className="text-muted-foreground">Carregando notas...</p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhuma nota encontrada para este usuário.
          </p>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="py-3">
                  <div className="text-sm text-muted-foreground">
                    {format(
                      new Date(note.createdAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      },
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
