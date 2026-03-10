export const govTheme = {
  brand: {
    blue: "#244b7a",
    blueStrong: "#1f3a5f",
    blueSoft: "#e7eef7",
    blueSurface: "#f2f6fb",
    sand: "#d8bf7a",
    green: "#2f6b57",
  },
  background: {
    page: "#f7f8fa",
    section: "#ffffff",
    alt: "#f1f4f8",
    emphasis: "#16324f",
  },
  text: {
    primary: "#1f2937",
    secondary: "#4b5563",
    muted: "#6b7280",
    inverse: "#f9fafb",
  },
  border: {
    subtle: "#d8e1ea",
    strong: "#a8b8cb",
  },
  status: {
    danger: "#a63c3c",
    dangerSoft: "#f9e7e7",
  },
  shadow: {
    soft: "0 18px 40px rgba(31, 58, 95, 0.08)",
    card: "0 10px 24px rgba(31, 58, 95, 0.06)",
  },
} as const;

export type GovTheme = typeof govTheme;
