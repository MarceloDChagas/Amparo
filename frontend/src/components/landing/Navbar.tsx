"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import { govTheme } from "./gov-theme";

interface NavbarProps {
  scrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const pathname = usePathname();

  const navItems = [
    { href: "#acesso-rapido", label: "Acesso rápido", hidden: false },
    { href: "#how-it-works", label: "Como funciona", hidden: true },
    { href: "#dados-publicos", label: "Dados públicos", hidden: true },
  ];

  const navLink = (href: string, label: string, hidden?: boolean) => {
    const isActive = pathname === href;

    return (
      <a
        href={href}
        className={`relative flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
          hidden ? "hidden md:flex" : ""
        }`}
        style={{
          color: isActive ? govTheme.brand.blueStrong : govTheme.text.secondary,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            govTheme.brand.blueStrong)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = isActive
            ? govTheme.brand.blueStrong
            : govTheme.text.secondary)
        }
      >
        {label}
        {isActive && (
          <span
            className="absolute -bottom-0.5 left-3 right-3 h-px rounded-full"
            style={{ backgroundColor: govTheme.brand.sand }}
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
          ? "rgba(255,255,255,0.98)"
          : "rgba(247,248,250,0.92)",
        borderBottom: scrolled
          ? `1px solid ${govTheme.border.subtle}`
          : `1px solid rgba(216, 225, 234, 0.78)`,
        backdropFilter: "blur(10px)",
        paddingTop: scrolled ? "0.75rem" : "1.15rem",
        paddingBottom: scrolled ? "0.75rem" : "0.95rem",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: govTheme.brand.blueSurface }}
          >
            <ShieldCheck size={18} style={{ color: govTheme.brand.blue }} />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: govTheme.brand.blue }}
            >
              Serviço público de proteção
            </span>
            <span
              className="text-base font-semibold"
              style={{ color: govTheme.text.primary }}
            >
              Amparo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {navItems.map((item) => navLink(item.href, item.label, item.hidden))}
          <div
            className="hidden md:block mx-2 w-px h-4 self-center"
            style={{ backgroundColor: govTheme.border.subtle }}
          />
          {navLink("/login", "Entrar")}
          <a
            href="/register"
            className="ml-1 hidden items-center rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex"
            style={{
              color: govTheme.text.inverse,
              backgroundColor: govTheme.brand.blue,
            }}
          >
            Acesso institucional
          </a>
        </div>
      </div>
    </nav>
  );
};
