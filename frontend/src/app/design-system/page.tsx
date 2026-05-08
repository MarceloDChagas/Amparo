/**
 * ㉑ — Página de design tokens + wordmark.
 * Consolida o conhecimento que hoje vive em comentários de código (RN01, RN04, etc.).
 * Rota interna: /design-system
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System | Amparo",
  description:
    "Tokens de design, paleta semântica e diretrizes de marca do Amparo.",
};

interface TokenRowProps {
  name: string;
  cssVar: string;
  hex: string;
  usage: string;
  counter?: string;
}

function TokenRow({ name, cssVar, hex, usage, counter }: TokenRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4">
        <div
          className="h-8 w-8 rounded-lg border border-border"
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />
      </td>
      <td className="py-3 pr-6">
        <code className="text-xs font-mono text-foreground">{cssVar}</code>
        <p className="text-[11px] text-muted-foreground mt-0.5">{hex}</p>
      </td>
      <td className="py-3 pr-6 text-sm text-foreground">{name}</td>
      <td className="py-3 pr-6 text-sm text-muted-foreground max-w-xs">
        {usage}
      </td>
      {counter && (
        <td className="py-3 text-sm text-muted-foreground italic">{counter}</td>
      )}
    </tr>
  );
}

const tokens: TokenRowProps[] = [
  {
    name: "Primary",
    cssVar: "--primary",
    hex: "#244b7a",
    usage: "Ações primárias, links, ícones de navegação no dashboard.",
    counter: "Nunca usar em contexto de emergência.",
  },
  {
    name: "Emergency",
    cssVar: "--emergency",
    hex: "#dc2626",
    usage:
      "RF01/RN01 — exclusivo para o blob de emergência, banners de alerta 190 e status PENDING/DISPATCHED.",
    counter:
      "Nunca usar para decoração, categorização ou itens da sidebar sem alerta ativo.",
  },
  {
    name: "Warning",
    cssVar: "--warning",
    hex: "#d97706",
    usage:
      "Dados restritos na sidebar (Agressores), deltas negativos de KPI, indicadores de atenção.",
    counter:
      "Não confundir com Emergency — warning é âmbar, emergency é vermelho.",
  },
  {
    name: "Success",
    cssVar: "--success",
    hex: "#16a34a",
    usage: "Estados concluídos, confirmações, deltas positivos de KPI.",
    counter:
      "Não usar para abrir conteúdo sensível — pode sugerir 'sem risco' erroneamente.",
  },
  {
    name: "Chart-2 (institucional verde)",
    cssVar: "--chart-2",
    hex: "#2f6b57",
    usage: "Eyebrows de seção, ícones de confiança, governança pública.",
    counter: undefined,
  },
  {
    name: "Chart-3 (dourado detalhe)",
    cssVar: "--chart-3",
    hex: "#d8bf7a",
    usage: "Faixa tricolor do hero (first segment), separadores decorativos.",
    counter: undefined,
  },
  {
    name: "Surface Emphasis",
    cssVar: "--surface-emphasis",
    hex: "#16324f",
    usage: "Fundo escuro da sidebar do dashboard institucional.",
    counter:
      "Não usar no app da vítima (superfície Aurora Suave tem paleta própria).",
  },
  {
    name: "Victim Primary (salmão)",
    cssVar: "--primary [data-surface=victim]",
    hex: "#c4705a",
    usage:
      "Ações primárias na superfície vítima (botões, links). Também é a cor da marca 'amparo' na sidebar escura.",
    counter:
      "Não usar como cor da marca no variant light — usar var(--foreground).",
  },
  {
    name: "Victim Accent (teal)",
    cssVar: "--accent [data-surface=victim]",
    hex: "#7ab5a0",
    usage: "Trajeto seguro, elementos de orientação na superfície vítima.",
    counter: undefined,
  },
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="mx-auto max-w-5xl space-y-14">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Referência interna
          </p>
          <h1 className="text-3xl font-bold text-foreground">Design System</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-7">
            Tokens semânticos, wordmark e diretrizes de uso do Amparo. Esta
            página substitui os comentários{" "}
            <code className="text-xs font-mono">RN0x</code> espalhados pelos
            componentes — referenciar pelo número do token aqui.
          </p>
        </div>

        {/* Wordmark */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Wordmark — <code className="text-sm font-mono">.amparo-mark</code>
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border p-6 bg-card flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Fundo claro (padrão)
              </p>
              <span className="amparo-mark text-2xl text-foreground">
                amparo
              </span>
              <code className="text-[11px] font-mono text-muted-foreground">
                color: var(--foreground)
              </code>
            </div>
            <div
              className="rounded-2xl border border-border p-6 flex flex-col gap-3"
              style={{ backgroundColor: "var(--surface-emphasis)" }}
            >
              <p className="text-xs" style={{ color: "rgba(249,250,251,0.4)" }}>
                Sidebar escura
              </p>
              <span
                className="amparo-mark text-2xl"
                style={{ color: "#c4705a" }}
              >
                amparo
              </span>
              <code
                className="text-[11px] font-mono"
                style={{ color: "rgba(249,250,251,0.35)" }}
              >
                color: #c4705a (salmão)
              </code>
            </div>
            <div
              className="rounded-2xl border border-border p-6 flex flex-col gap-3"
              style={{ background: "linear-gradient(180deg,#f0e4f5,#f6dccd)" }}
            >
              <p className="text-xs" style={{ color: "rgba(58,37,48,0.6)" }}>
                App vítima (light header)
              </p>
              <span
                className="amparo-mark text-2xl"
                style={{ color: "var(--foreground)" }}
              >
                amparo
              </span>
              <code
                className="text-[11px] font-mono"
                style={{ color: "rgba(58,37,48,0.45)" }}
              >
                color: var(--foreground) — ⑫
              </code>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Sempre usar a classe <code className="font-mono">.amparo-mark</code>{" "}
            em vez de declarar{" "}
            <code className="font-mono">font-family/font-weight</code> inline.
            Garante reprodução fiel em parceiros e integrações.
          </p>
        </section>

        {/* Tokens */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Tokens semânticos
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Todos declarados em{" "}
            <code className="font-mono text-xs">
              frontend/src/app/globals.css
            </code>
            . Não criar novos tokens sem atualizar esta tabela.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-10" />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quando usar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contra-indicação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {tokens.map((t) => (
                  <TokenRow key={t.cssVar} {...t} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Requisitos não-funcionais */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Requisitos referenciados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                id: "RF01",
                desc: "Botão de emergência — blob acionável após hold de 2s.",
              },
              {
                id: "RN01",
                desc: "Ativação por tempo contínuo — sem disparo por toque simples.",
              },
              {
                id: "RN02",
                desc: "Impossibilidade de autocancelamento após disparo.",
              },
              {
                id: "RN04",
                desc: "Dado sensível (Agressores) sinalizado com indicador restrito, não vermelho.",
              },
              {
                id: "NRF05",
                desc: "Geolocalização com timeout 8s + fallback documentado (passo 2 de localização manual).",
              },
              {
                id: "NRF09",
                desc: "Usabilidade sob estresse: áreas clicáveis ≥44px, instruções visíveis antes do primeiro toque.",
              },
              {
                id: "NRF10",
                desc: "Acessibilidade: aria-current, aria-label, role=progressbar, aria-live nos badges.",
              },
            ].map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border px-4 py-3 bg-card"
              >
                <code className="text-xs font-mono font-semibold text-primary">
                  {r.id}
                </code>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
