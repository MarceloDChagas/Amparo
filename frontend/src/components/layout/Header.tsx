"use client";

import { govTheme } from "@/components/landing/gov-theme";
import { useAuth } from "@/presentation/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={{
        borderBottom: `1px solid ${govTheme.border.subtle}`,
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="text-lg font-semibold"
        style={{ color: govTheme.text.primary }}
      >
        {/* Breadcrumb or Title placeholder */}
        Dashboard
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <p className="font-medium" style={{ color: govTheme.text.primary }}>
            {user?.name || "Usuário"}
          </p>
          <p className="text-xs" style={{ color: govTheme.text.muted }}>
            {user?.email}
          </p>
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full font-bold"
          style={{
            color: govTheme.text.inverse,
            backgroundColor: govTheme.brand.blue,
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
