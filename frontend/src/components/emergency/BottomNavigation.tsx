import {
  FileText,
  House,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import React from "react";

import { govTheme } from "@/components/landing/gov-theme";

export type MainTabType =
  | "HOME"
  | "REGISTERS"
  | "SUPPORT"
  | "MESSAGES"
  | "PROFILE";

interface BottomNavigationProps {
  activeMainTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export function BottomNavigation({
  activeMainTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs: Array<{
    id: MainTabType;
    label: string;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }> = [
    { id: "HOME", label: "Início", icon: House },
    { id: "REGISTERS", label: "Registros", icon: FileText },
    { id: "SUPPORT", label: "Rede de apoio", icon: Users },
    { id: "MESSAGES", label: "Mensagens", icon: MessageCircle },
    { id: "PROFILE", label: "Perfil e segurança", icon: ShieldCheck },
  ];

  return (
    <nav
      className="rounded-t-[28px] border-t px-2 py-3 pb-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(168, 184, 203, 0.45)",
        boxShadow: "0 -12px 32px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-3xl items-start justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-2xl px-2 py-2 transition-colors"
              style={{
                backgroundColor: isActive
                  ? govTheme.brand.blueSurface
                  : "transparent",
              }}
            >
              <Icon
                size={22}
                style={{
                  color: isActive
                    ? govTheme.brand.blueStrong
                    : govTheme.text.muted,
                }}
              />
              <span
                className="text-center text-[10px] font-medium leading-tight"
                style={{
                  color: isActive
                    ? govTheme.brand.blueStrong
                    : govTheme.text.muted,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
