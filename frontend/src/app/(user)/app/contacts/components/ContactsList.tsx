"use client";

import { Loader2, Phone, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useDeleteEmergencyContact } from "@/data/hooks/use-delete-emergency-contact";
import { useGetEmergencyContacts } from "@/data/hooks/use-get-emergency-contacts";

const RELATIONSHIP_LABELS: Record<string, string> = {
  Mother: "Mãe",
  Father: "Pai",
  Sibling: "Irmão/Irmã",
  Friend: "Amigo(a)",
  Partner: "Parceiro(a)",
  Other: "Outro",
};

export function ContactsList() {
  const { data: contacts, isLoading } = useGetEmergencyContacts();
  const { mutate: deleteContact, isPending: isDeleting } =
    useDeleteEmergencyContact();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleDelete(id: string) {
    deleteContact(id, {
      onSuccess: () => {
        toast.success("Contato removido.");
        setConfirmDeleteId(null);
      },
      onError: () => {
        toast.error("Não foi possível remover o contato.");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div
        className="rounded-[24px] border p-8 flex flex-col items-center text-center"
        style={{
          borderColor: "#bfd0e0",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,253,0.98) 100%)",
        }}
      >
        <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          Nenhum contato adicionado
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Use o formulário abaixo para cadastrar seu primeiro contato de
          emergência.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] border p-5 sm:p-7 space-y-3"
      style={{
        borderColor: "#bfd0e0",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,253,0.98) 100%)",
        boxShadow:
          "0 20px 60px rgba(15, 23, 42, 0.08), 0 2px 12px rgba(36, 75, 122, 0.05)",
      }}
    >
      <h3 className="text-base font-semibold text-foreground mb-4">
        Seus contatos ({contacts.length}/3)
      </h3>

      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 bg-secondary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
            <Phone size={16} className="text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {contact.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {RELATIONSHIP_LABELS[contact.relationship] ??
                contact.relationship}{" "}
              · {contact.phone}
            </p>
          </div>

          {confirmDeleteId === contact.id ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDelete(contact.id)}
                disabled={isDeleting}
                className="px-2.5 py-1 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Removendo..." : "Confirmar"}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDeleteId(contact.id)}
              aria-label={`Remover ${contact.name}`}
              className="p-2 text-muted-foreground/50 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
