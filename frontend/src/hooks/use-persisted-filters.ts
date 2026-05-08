// ⑰ — Filtros persistidos em localStorage por página: plantão não refaz filtro a cada login
import { useCallback, useState } from "react";

export interface TableFilters {
  period: "24h" | "7d" | "30d" | "all";
  status: string; // varia por entidade: "PENDING" | "ACTIVE" | "all" etc.
}

const DEFAULT_FILTERS: TableFilters = {
  period: "24h",
  status: "all",
};

export function usePersistedFilters(
  storageKey: string,
  defaults: Partial<TableFilters> = {},
) {
  const fullDefaults: TableFilters = { ...DEFAULT_FILTERS, ...defaults };

  function load(): TableFilters {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return fullDefaults;
      return { ...fullDefaults, ...JSON.parse(raw) };
    } catch {
      return fullDefaults;
    }
  }

  const [filters, setFiltersState] = useState<TableFilters>(load);

  const setFilters = useCallback(
    (update: Partial<TableFilters>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...update };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignorar
        }
        return next;
      });
    },
    [storageKey],
  );

  return { filters, setFilters };
}
