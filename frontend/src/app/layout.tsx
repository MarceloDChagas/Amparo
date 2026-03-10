import "./globals.css";

import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/presentation/hooks/useAuth";

import QueryProvider from "./query-provider";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Amparo | Plataforma Institucional",
    template: "%s | Amparo",
  },
  description:
    "Sistema institucional do Amparo para acolhimento, acompanhamento e coordenação entre serviços autorizados.",
  applicationName: "Amparo",
  openGraph: {
    title: "Amparo | Plataforma Institucional",
    description:
      "Sistema institucional do Amparo para acolhimento, acompanhamento e coordenação entre serviços autorizados.",
    siteName: "Amparo",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Amparo | Plataforma Institucional",
    description:
      "Sistema institucional do Amparo para acolhimento, acompanhamento e coordenação entre serviços autorizados.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sourceSans.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
