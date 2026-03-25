"use client";

import { Loader2, Trash2, Users } from "lucide-react";
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0][0] ?? "?").toUpperCase();
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

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
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#244b7a" }} />
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div
        className="rounded-[24px] border p-8 flex flex-col items-center text-center"
        style={{ borderColor: "#bfd0e0", backgroundColor: "#ffffff" }}
      >
        <Users className="h-10 w-10 mb-3" style={{ color: "#94a3b8" }} />
        <p className="text-sm font-semibold" style={{ color: "#1f2937" }}>
          Nenhum contato adicionado
        </p>
        <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
          Use o formulário abaixo para cadastrar seu primeiro contato de emergência.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] border p-5 sm:p-6"
      style={{
        borderColor: "#bfd0e0",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#6b7280" }}
      >
        Seus contatos ({Math.min(contacts.length, 3)}/3)
      </p>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-4 rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "#f4f7fb",
              border: "1px solid #d8e1ea",
            }}
          >
            {/* Avatar com iniciais */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: "#244b7a" }}
              aria-hidden="true"
            >
              {getInitials(contact.name)}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#1f2937" }}
              >
                {contact.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                {RELATIONSHIP_LABELS[contact.relationship] ?? contact.relationship}
                {" · "}
                {contact.phone}
              </p>
            </div>

            {confirmDeleteId === contact.id ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleDelete(contact.id)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  style={{
                    color: "#dc2626",
                    backgroundColor: "#fee2e2",
                  }}
                >
                  {isDeleting ? "..." : "Remover"}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ color: "#6b7280", backgroundColor: "#e5e7eb" }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(contact.id)}
                aria-label={`Remover ${contact.name}`}
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ color: "#9ca3af" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#dc2626";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#fee2e2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
