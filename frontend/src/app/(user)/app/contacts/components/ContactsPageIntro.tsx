import { ArrowLeft, Users } from "lucide-react";

interface ContactsPageIntroProps {
  onBack: () => void;
}

export function ContactsPageIntro({ onBack }: ContactsPageIntroProps) {
  return (
    <>
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-border p-2 transition-colors hover:opacity-90 text-accent-foreground"
          style={{
            backgroundColor: "rgba(255,255,255,0.84)",
          }}
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold leading-tight sm:text-2xl text-foreground">
            Contatos de Emergência
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pessoas que serão notificadas em caso de alerta
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 rounded-4xl border px-4 py-4 shadow-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: "rgba(168, 184, 203, 0.65)",
        }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
          <Users size={18} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          Seus contatos de confiança receberão um e-mail imediatamente ao
          acionar o alerta de emergência.
        </p>
      </div>
    </>
  );
}
