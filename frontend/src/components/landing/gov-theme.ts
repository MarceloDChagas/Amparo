/**
 * Tokens do tema institucional do Dashboard Operacional.
 *
 * Todos os valores referenciam CSS custom properties definidas em globals.css.
 * Isso garante que mudanças no design system (dark mode, tema por superfície)
 * se propaguem automaticamente para todos os componentes que usam govTheme.
 *
 * NRF02 — Arquitetura Limpa: tokens de design isolados da lógica de componente.
 * RN04 — Restrição de Acesso e Sigilo: status.danger sinaliza dados restritos.
 */
export const govTheme = {
  brand: {
    blue: "var(--primary)",
    blueStrong: "var(--accent-foreground)",
    blueSoft: "var(--accent)",
    blueSurface: "var(--accent)",
    sand: "var(--chart-3)",
    green: "var(--chart-2)",
  },
  background: {
    page: "var(--background)",
    section: "var(--card)",
    alt: "var(--secondary)",
    emphasis: "var(--surface-emphasis)",
  },
  text: {
    primary: "var(--foreground)",
    secondary: "#4b5563",
    muted: "var(--muted-foreground)",
    inverse: "var(--primary-foreground)",
  },
  border: {
    subtle: "var(--border)",
    strong: "var(--ring)",
  },
  status: {
    danger: "var(--destructive)",
    dangerSoft: "var(--destructive-soft)",
  },
  shadow: {
    soft: "0 18px 40px rgba(31, 58, 95, 0.08)",
    card: "0 10px 24px rgba(31, 58, 95, 0.06)",
  },
} as const;

export type GovTheme = typeof govTheme;
