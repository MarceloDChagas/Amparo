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
      } else if (user.role === "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      // data-surface="user" ativa o contexto de tema do usuário comum (globals.css)
      <div
        className="flex h-screen items-center justify-center bg-background"
        data-surface="user"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role === "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-surface="user">
      {children}
    </div>
  );
}
