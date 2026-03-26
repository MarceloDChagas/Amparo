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
        className="flex h-screen items-center justify-center"
        data-surface="victim"
        style={{
          background:
            "radial-gradient(ellipse at top left, #ede0f5, #f5d4c0 70%)",
        }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role === "ADMIN") {
    return null;
  }

  return (
    <div
      className="min-h-screen w-full"
      data-surface="victim"
      style={{
        background:
          "radial-gradient(ellipse at top left, #ede0f5, #f5d4c0 70%)",
      }}
    >
      {children}
    </div>
  );
}
