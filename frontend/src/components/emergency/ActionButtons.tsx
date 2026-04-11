/**
 * Atalhos de ação rápida do app do usuário.
 *
 * RF11 — Gestão de Contatos de Emergência: atalho para a rede de apoio.
 * RF09 — Registro de Notas de Segurança: atalho para notas pessoais.
 *
 * NRF09 — Usabilidade Sob Estresse: active:scale-95 para feedback tátil imediato.
 * NRF10 — Acessibilidade: cada botão tem ícone + texto visível (nunca só ícone).
 */
import { ChevronRight, NotebookPen, Users } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    href: "/app/contacts",
    icon: Users,
    iconColor: "#c4705a",
    accentColor: "rgba(196,112,90,0.35)",
    label: "Rede de apoio",
    description: "Contatos de emergência",
    ariaLabel: "Ir para rede de apoio — gerenciar contatos de emergência",
  },
  {
    href: "/app/notes",
    icon: NotebookPen,
    iconColor: "#5a9e8a",
    accentColor: "rgba(90,158,138,0.35)",
    label: "Minhas notas",
    description: "Registros pessoais",
    ariaLabel: "Ir para minhas notas — registrar observações pessoais",
  },
] as const;

export function ActionButtons() {
  return (
    <div className="w-full max-w-md px-4 mb-8 flex flex-col gap-2.5">
      {actions.map(
        ({
          href,
          icon: Icon,
          iconColor,
          accentColor,
          label,
          description,
          ariaLabel,
        }) => (
          <Link key={href} href={href} className="block">
            <button
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: "rgba(255,255,255,0.52)",
                border: "1px solid rgba(180,140,160,0.18)",
                backdropFilter: "blur(8px)",
              }}
              aria-label={ariaLabel}
            >
              {/* Accent dot — substituiu o icon-in-box genérico */}
              <div
                aria-hidden="true"
                className="shrink-0 rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 0 3px ${accentColor.replace("0.35", "0.12")}`,
                }}
              />

              <Icon
                aria-hidden="true"
                size={18}
                style={{ color: iconColor, flexShrink: 0 }}
              />

              <div className="flex-1 text-left min-w-0">
                <div
                  className="text-sm leading-tight"
                  style={{ fontWeight: 600, color: "#3a2530" }}
                >
                  {label}
                </div>
                <div
                  className="text-xs leading-tight mt-0.5"
                  style={{ color: "rgba(90,53,69,0.55)" }}
                >
                  {description}
                </div>
              </div>

              <ChevronRight
                aria-hidden="true"
                size={15}
                style={{ color: "rgba(90,53,69,0.25)", flexShrink: 0 }}
              />
            </button>
          </Link>
        ),
      )}
    </div>
  );
}
