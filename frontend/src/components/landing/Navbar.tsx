"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import { colors } from "@/styles/colors";

interface NavbarProps {
  scrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const pathname = usePathname();

  const navLink = (
    href: string,
    label: string,
    opts?: { hidden?: boolean },
  ) => {
    const isActive = pathname === href;
    return (
      <a
        href={href}
        className={`relative flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
          opts?.hidden ? "hidden md:flex" : ""
        }`}
        style={{
          color: isActive
            ? colors.functional.text.primary
            : colors.functional.text.secondary,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            colors.functional.text.primary)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = isActive
            ? colors.functional.text.primary
            : colors.functional.text.secondary)
        }
      >
        {label}
        {isActive && (
          <span
            className="absolute -bottom-0.5 left-3 right-3 h-px rounded-full"
            style={{ backgroundColor: colors.accent[500] }}
          />
        )}
      </a>
    );
  };

  return (
    <nav
      className="fixed top-0 w-full z-40 transition-all duration-200"
      style={{
        backgroundColor: scrolled
          ? colors.functional.background.primary
          : "transparent",
        borderBottom: scrolled
          ? `1px solid ${colors.functional.border.dark}`
          : "none",
        paddingTop: scrolled ? "0.75rem" : "1.5rem",
        paddingBottom: scrolled ? "0.75rem" : "1.5rem",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} style={{ color: colors.accent[500] }} />
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: colors.functional.text.primary }}
          >
            Amparo
          </span>
          <span
            className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded"
            style={{
              color: "#818cf8",
              backgroundColor: "rgba(55,48,163,0.2)",
              border: "1px solid rgba(67,56,202,0.4)",
            }}
          >
            gov
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navLink("#features", "Funcionalidades", { hidden: true })}
          {navLink("#how-it-works", "Como funciona", { hidden: true })}
          <div
            className="hidden md:block mx-2 w-px h-4 self-center"
            style={{ backgroundColor: colors.functional.border.light }}
          />
          {navLink("/login", "Entrar")}
          <a
            href="/register"
            className="hidden sm:inline-flex items-center px-4 py-2 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 ml-1"
            style={{ backgroundColor: colors.accent[600] }}
          >
            Criar Conta
          </a>
        </div>
      </div>
    </nav>
  );
};
