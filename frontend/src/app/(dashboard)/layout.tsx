"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "VICTIM") {
        router.push("/app");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: govTheme.background.page }}
      >
        <div
          className="h-12 w-12 animate-spin rounded-full border-b-2"
          style={{ borderColor: govTheme.brand.blue }}
        />
      </div>
    );
  }

  if (!user || user.role === "VICTIM") {
    return null; // Will redirect
  }

  return (
    <div
      className="relative h-full"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="z-80 hidden h-full md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <Sidebar />
      </div>
      <main className="h-full md:pl-72">
        <Header />
        <div
          className="h-[calc(100vh-64px)] overflow-y-auto p-8"
          style={{ backgroundColor: govTheme.background.page }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
