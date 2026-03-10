import { ArrowLeft, Users } from "lucide-react";

import { govTheme } from "@/components/landing/gov-theme";

interface ContactsPageIntroProps {
  onBack: () => void;
}

export function ContactsPageIntro({ onBack }: ContactsPageIntroProps) {
  return (
    <>
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="rounded-full border p-2 transition-colors hover:opacity-90"
          style={{
            backgroundColor: "rgba(255,255,255,0.84)",
            borderColor: govTheme.border.subtle,
            color: govTheme.brand.blueStrong,
          }}
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2
            className="text-xl font-bold leading-tight sm:text-2xl"
            style={{ color: govTheme.text.primary }}
          >
            Contatos de Emergência
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: govTheme.text.secondary }}
          >
            Pessoas que serão notificadas em caso de alerta
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 rounded-4xl border px-4 py-4"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: "rgba(168, 184, 203, 0.65)",
          boxShadow: govTheme.shadow.card,
        }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: govTheme.brand.blueSurface }}
        >
          <Users size={18} style={{ color: govTheme.brand.blue }} />
        </div>
        <p className="text-sm" style={{ color: govTheme.text.secondary }}>
          Seus contatos de confiança receberão um e-mail imediatamente ao
          acionar o alerta de emergência.
        </p>
      </div>
    </>
  );
}
