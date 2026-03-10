"use client";

import { Bell, FileText, Home, LogOut, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { govTheme } from "@/components/landing/gov-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/presentation/hooks/useAuth";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: govTheme.brand.blue,
  },
  {
    label: "Usuários",
    icon: Users,
    href: "/users",
    color: govTheme.brand.green,
  },
  {
    label: "Agressores",
    icon: ShieldAlert,
    href: "/aggressors",
    color: govTheme.status.danger,
  },
  {
    label: "Ocorrências",
    icon: FileText,
    href: "/occurrences",
    color: govTheme.brand.sand,
  },
  {
    label: "Notificações",
    icon: Bell,
    href: "/notifications",
    color: govTheme.brand.blueStrong,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div
      className="flex h-full flex-col space-y-4 py-4"
      style={{
        backgroundColor: govTheme.background.emphasis,
        color: govTheme.text.inverse,
        borderRight: `1px solid ${govTheme.border.strong}`,
      }}
    >
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(249, 250, 251, 0.72)" }}
            >
              Painel institucional
            </p>
            <h1 className="text-2xl font-bold">Amparo</h1>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex w-full cursor-pointer justify-start rounded-xl p-3 text-sm font-medium transition",
                pathname === route.href ? "text-white" : "",
              )}
              style={{
                backgroundColor:
                  pathname === route.href
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                color:
                  pathname === route.href
                    ? govTheme.text.inverse
                    : "rgba(249, 250, 251, 0.72)",
              }}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className="mr-3 h-5 w-5"
                  style={{ color: route.color }}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start rounded-xl"
          style={{ color: "rgba(249, 250, 251, 0.72)" }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
