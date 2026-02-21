import "./globals.css";

import { QuickExitButton } from "@/components/layout/QuickExitButton";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/presentation/hooks/useAuth";

import QueryProvider from "./query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <QuickExitButton />
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
