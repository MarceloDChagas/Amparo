/**
 * Atalhos de ação rápida do app da vítima.
 *
 * RF11 — Gestão de Contatos de Emergência: atalho para a rede de apoio.
 * RF09 — Registro de Notas de Segurança: atalho para memória do caso.
 *
 * NRF09 — Usabilidade Sob Estresse: active:scale-95 para feedback tátil imediato.
 * NRF10 — Acessibilidade: cada botão tem ícone + texto visível (nunca só ícone).
 */
import { NotebookPen, Users } from "lucide-react";
import Link from "next/link";

export function ActionButtons() {
  return (
    <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8 px-4">
      <Link href="/app/contacts" className="flex-1">
        <button
          className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          // var(--primary) no contexto victim = violeta #7c3aed
          style={{ backgroundColor: "var(--primary)" }}
          aria-label="Ir para rede de apoio — gerenciar contatos de emergência"
        >
          <Users size={24} color="white" aria-hidden="true" />
          <span className="font-semibold text-xs text-center leading-tight text-white">
            Rede de{"\n"}apoio
          </span>
        </button>
      </Link>

      <Link href="/app/notes" className="flex-1">
        <button
          className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: "var(--primary)" }}
          aria-label="Ir para memória do caso — registrar notas de segurança"
        >
          <NotebookPen size={24} color="white" aria-hidden="true" />
          <span className="font-semibold text-xs text-center leading-tight text-white">
            Memória do{"\n"}caso
          </span>
        </button>
      </Link>
    </div>
  );
}
