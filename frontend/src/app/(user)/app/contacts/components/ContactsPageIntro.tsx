import { ArrowLeft } from "lucide-react";

interface ContactsPageIntroProps {
  onBack: () => void;
}

export function ContactsPageIntro({ onBack }: ContactsPageIntroProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onBack}
        className="mt-1 rounded-full p-2 transition-colors shrink-0"
        style={{
          border: "1px solid rgba(180,140,160,0.30)",
          backgroundColor: "transparent",
          color: "#7a5565",
        }}
        aria-label="Voltar"
      >
        <ArrowLeft size={18} />
      </button>
      <div>
        <h2
          className="text-xl font-bold leading-tight sm:text-2xl"
          style={{ color: "#3a2530" }}
        >
          Rede de apoio
        </h2>
        <p className="mt-1 text-sm" style={{ color: "#7a5565" }}>
          Ao acionar o alerta, cada contato abaixo recebe um e-mail
          imediatamente.
        </p>
      </div>
    </div>
  );
}
