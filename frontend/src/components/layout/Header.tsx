"use client";

import { useAuth } from "@/presentation/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 justify-between">
      <div className="font-semibold text-lg text-gray-800">
        {/* Breadcrumb or Title placeholder */}
        Dashboard
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <p className="font-medium text-gray-900">{user?.name || "Usuário"}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
