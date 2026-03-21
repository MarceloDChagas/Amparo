"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/presentation/hooks/useAuth";

export default function UserLayout({
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
      } else if (user.role !== "VICTIM") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      // data-surface="victim" ativa o contexto de tema da vítima (globals.css)
      <div
        className="flex h-screen items-center justify-center bg-background"
        data-surface="victim"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== "VICTIM") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-surface="victim">
      {children}
    </div>
  );
}
