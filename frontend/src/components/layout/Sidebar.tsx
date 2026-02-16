"use client";

import {
  AlertTriangle,
  FileText,
  Home,
  LogOut,
  Phone,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/presentation/hooks/useAuth";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Vítimas",
    icon: Users,
    href: "/victims",
    color: "text-violet-500",
  },
  {
    label: "Agressores",
    icon: ShieldAlert,
    href: "/aggressors",
    color: "text-red-500",
  },
  {
    label: "Ocorrências",
    icon: FileText,
    href: "/occurrences",
    color: "text-orange-500",
  },
  {
    label: "Emergência",
    icon: AlertTriangle,
    href: "/emergency",
    color: "text-pink-500",
  },
  {
    label: "Contatos",
    icon: Phone,
    href: "/emergency-contacts",
    color: "text-emerald-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth(); // Assuming useAuth provides logout

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Amparo</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
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
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
