/**
 * Paleta Dark Mode Acolhimento - Sistema Amparo
 * Navy Profundo + Rosa/Violeta Acolhedor
 */

export const colors = {
  // Navy Profundo - Background dark mode
  primary: {
    50: "#f0f1f9",
    100: "#e0e3f2",
    200: "#c8cde8",
    300: "#a5add9",
    400: "#8088c7",
    500: "#6569b8",
    600: "#5552a7",
    700: "#494596",
    800: "#3f3b7b",
    900: "#1a1d3a", // Navy Profundo - Background principal
    950: "#0f1123", // Navy Super Escuro
  },

  // Rosa Acolhedor - Ações e destaques
  secondary: {
    50: "#fef1f9",
    100: "#fee5f4",
    200: "#ffcbea",
    300: "#ffb3d9", // Rosa Claro - Hover states
    400: "#ff8cc8",
    500: "#f95daf",
    600: "#e63890", // Rosa Vibrante - CTAs
    700: "#c92773",
    800: "#a5235f",
    900: "#892252",
  },

  // Violeta Empoderador - Elementos de marca
  accent: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Violeta Base
    600: "#9333ea",
    700: "#7c3aed", // Violeta Principal
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // Cores de Status
  status: {
    success: {
      light: "#4ade80",
      DEFAULT: "#22c55e",
      dark: "#16a34a",
    },
    warning: {
      light: "#fbbf24",
      DEFAULT: "#f59e0b",
      dark: "#d97706",
    },
    error: {
      light: "#f87171",
      DEFAULT: "#ef4444",
      dark: "#dc2626",
    },
    info: {
      light: "#67e8f9",
      DEFAULT: "#06b6d4",
      dark: "#0891b2",
    },
  },

  // Cores Neutras - Otimizadas para dark mode
  neutral: {
    50: "#fafafa", // Branco - Elementos claros
    100: "#f5f5f5", // Cinza super claro
    200: "#e5e5e5", // Cinza claro
    300: "#d4d4d4", // Cinza médio claro
    400: "#a3a3a3", // Cinza médio
    500: "#737373", // Cinza
    600: "#525252", // Cinza escuro
    700: "#3d3d4e", // Cinza dark slate
    800: "#2a2d4a", // Navy médio
    900: "#1f2138", // Navy escuro
    950: "#0f1123", // Navy super escuro
  },

  // Cores Funcionais
  functional: {
    background: {
      primary: "#1a1d3a", // Navy Profundo - Background principal
      secondary: "#2a2d4a", // Navy médio - Cards
      tertiary: "#1f2138", // Navy escuro - Sections alternadas
      light: "#ffffff", // Branco - Navbar
      card: "#252844", // Navy card
    },
    text: {
      primary: "#ffffff", // Branco - Texto principal
      secondary: "#d4d4d4", // Cinza claro - Texto secundário
      tertiary: "#a3a3a3", // Cinza médio - Texto terciário
      inverse: "#1a1d3a", // Navy - Texto em backgrounds claros
      accent: "#ffb3d9", // Rosa claro - Destaques
      muted: "#8a8a9e", // Cinza azulado - Texto desabilitado
    },
    border: {
      light: "#3d3d4e", // Cinza dark slate
      DEFAULT: "#2a2d4a", // Navy médio
      dark: "#1f2138", // Navy escuro
      accent: "#6b21a8", // Violeta escuro
    },
  },

  // Gradientes Pré-definidos
  gradients: {
    primary: "linear-gradient(to right, #7c3aed, #e63890)", // Violet to Pink
    primaryBr: "linear-gradient(to bottom right, #7c3aed, #e63890)", // primary bottom-right
    hero: "linear-gradient(to right, #9333ea, #ff8cc8, #9333ea)", // Hero animado
    cta: "linear-gradient(to bottom right, #a855f7, #e63890)", // Violet to Pink vibrant
    card: "linear-gradient(to bottom right, #7c3aed, #ff8cc8)", // Card gradient
    dark: "linear-gradient(to bottom, #1a1d3a, #0f1123)", // Navy gradient
    darkRadial: "radial-gradient(circle at top, #2a2d4a, #1a1d3a)", // Radial dark
  },

  // Cores de Overlay/Blur
  overlay: {
    light: "rgba(255, 255, 255, 0.05)", // Overlay muito sutil
    medium: "rgba(255, 255, 255, 0.1)", // Overlay claro
    heavy: "rgba(255, 255, 255, 0.15)", // Overlay médio
    dark: "rgba(26, 29, 58, 0.85)", // Navy overlay
  },

  // Cores Especiais
  special: {
    quickExit: "#dc2626", // Red-600 para botão de saída rápida
    selection: "#ffcbea", // Rosa claro para seleção de texto
    glow: {
      violet: "rgba(124, 58, 237, 0.4)", // Glow violet
      pink: "rgba(255, 179, 217, 0.5)", // Glow pink
      cyan: "rgba(6, 182, 212, 0.3)", // Glow cyan
    },
    shadow: {
      violet: "rgba(124, 58, 237, 0.3)",
      rose: "rgba(230, 56, 144, 0.3)",
      dark: "rgba(0, 0, 0, 0.5)",
    },
  },
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type SecondaryColor = keyof typeof colors.secondary;
export type AccentColor = keyof typeof colors.accent;

/**
 * Mapeamento semântico para CSS custom properties definidas em globals.css.
 * Preferir estes tokens em código novo em vez de acessar a paleta raw acima.
 *
 * Uso: style={{ backgroundColor: tokens.emergency }}
 * Equivale a: style={{ backgroundColor: "var(--emergency)" }}
 *
 * RF01/RN01 — tokens.emergency é VERMELHO reservado para emergência.
 * RN04 — tokens.primary no contexto user = violeta (não azul institucional).
 */
export const tokens = {
  /* Ações principais — muda conforme data-surface (azul no dashboard, violeta no app) */
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",

  /* Backgrounds e superfícies */
  background: "var(--background)",
  card: "var(--card)",
  cardForeground: "var(--card-foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",

  /* Bordas */
  border: "var(--border)",
  ring: "var(--ring)",

  /* Status semânticos — RF03 (check-in), RF01 (emergência) */
  emergency: "var(--emergency)",
  emergencyForeground: "var(--emergency-foreground)",
  emergencySoft: "var(--emergency-soft)",
  warning: "var(--warning)",
  warningForeground: "var(--warning-foreground)",
  warningSoft: "var(--warning-soft)",
  success: "var(--success)",
  successForeground: "var(--success-foreground)",
  successSoft: "var(--success-soft)",
  amber: "var(--amber)",
  amberForeground: "var(--amber-foreground)",
  destructive: "var(--destructive)",
  destructiveSoft: "var(--destructive-soft)",
} as const;

export type Tokens = typeof tokens;
