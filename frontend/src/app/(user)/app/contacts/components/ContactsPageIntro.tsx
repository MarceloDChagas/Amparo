import { ArrowLeft } from "lucide-react";

interface ContactsPageIntroProps {
  onBack: () => void;
}

export function ContactsPageIntro({ onBack }: ContactsPageIntroProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onBack}
        className="mt-1 rounded-full border border-border p-2 transition-colors hover:bg-accent shrink-0"
        aria-label="Voltar"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <div>
        <h2 className="text-xl font-bold leading-tight sm:text-2xl text-foreground">
          Rede de apoio
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ao acionar o alerta, cada contato abaixo recebe um e-mail
          imediatamente.
        </p>
      </div>
    </div>
  );
}
