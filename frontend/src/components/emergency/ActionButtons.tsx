/**
 * Atalhos de ação rápida do app do usuário.
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
    <div className="w-full max-w-md px-4 mb-8">
      {/* Rótulo de seção com hierarquia clara — antes era um label solto sem contexto */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        Acesso rápido
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/app/contacts" className="flex-1">
          <button
            className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2.5 transition-transform active:scale-95 border"
            style={{
              backgroundColor: "rgba(124, 58, 237, 0.18)",
              borderColor: "rgba(167, 139, 250, 0.25)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Ir para rede de apoio — gerenciar contatos de emergência"
          >
            {/* Wrapper de contraste: fundo branco/20 garante legibilidade do ícone */}
            <div
              aria-hidden="true"
              className="rounded-xl p-2"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              <Users size={22} color="white" />
            </div>
            <span className="font-semibold text-xs text-center leading-tight text-white">
              Rede de{"\n"}apoio
            </span>
          </button>
        </Link>

        <Link href="/app/notes" className="flex-1">
          <button
            className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2.5 transition-transform active:scale-95 border"
            style={{
              backgroundColor: "rgba(124, 58, 237, 0.18)",
              borderColor: "rgba(167, 139, 250, 0.25)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Ir para minhas notas — registrar observações e anotações"
          >
            <div
              aria-hidden="true"
              className="rounded-xl p-2"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              <NotebookPen size={22} color="white" />
            </div>
            <span className="font-semibold text-xs text-center leading-tight text-white">
              Minhas{"\n"}notas
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
