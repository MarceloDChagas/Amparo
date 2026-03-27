"use client";

import {
  CheckCircle2,
  Loader2,
  MapPin,
  Play,
  Plus,
  RefreshCw,
  Route,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PatrolRoute,
  patrolRouteService,
  PatrolRouteStatus,
} from "@/services/patrol-route-service";

// Mapa Leaflet só no cliente
const PatrolRouteMap = dynamic(() => import("./PatrolRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-xl border text-sm text-muted-foreground bg-secondary border-border">
      Carregando mapa…
    </div>
  ),
});

const STATUS_LABEL: Record<PatrolRouteStatus, string> = {
  PENDING: "Aguardando",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const STATUS_VARIANT: Record<PatrolRouteStatus, BadgeVariant> = {
  PENDING: "pending",
  IN_PROGRESS: "active",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export default function PatrolRoutesPage() {
  const [routes, setRoutes] = useState<PatrolRoute[]>([]);
  const [selected, setSelected] = useState<PatrolRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState({
    name: "Rota de patrulha",
    maxWaypoints: "8",
    vehicleLatitude: "",
    vehicleLongitude: "",
  });

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await patrolRouteService.getAll();
      setRoutes(data);
      if (!selected && data.length > 0) setSelected(data[0]);
    } catch {
      setError("Erro ao carregar rotas.");
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    void loadRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!form.name.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const route = await patrolRouteService.generate({
        name: form.name,
        maxWaypoints: parseInt(form.maxWaypoints) || 8,
        vehicleLatitude: form.vehicleLatitude
          ? parseFloat(form.vehicleLatitude)
          : undefined,
        vehicleLongitude: form.vehicleLongitude
          ? parseFloat(form.vehicleLongitude)
          : undefined,
      });
      setRoutes((prev) => [route, ...prev]);
      setSelected(route);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar rota.");
    } finally {
      setGenerating(false);
    }
  };

  const handleStatus = async (id: string, status: PatrolRouteStatus) => {
    try {
      const updated = await patrolRouteService.updateStatus(id, status);
      setRoutes((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selected?.id === id) setSelected(updated);
    } catch {
      setError("Erro ao atualizar status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Route className="h-6 w-6 text-primary" />
            Rotas Inteligentes de Patrulha
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Trajetos calculados com base na densidade do mapa de calor (AM-74)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadRoutes()}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna esquerda — formulário + lista */}
        <div className="space-y-4">
          {/* Gerar nova rota */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" /> Gerar nova rota
            </h3>

            <div className="space-y-2">
              <Label htmlFor="route-name" className="text-xs">
                Nome
              </Label>
              <Input
                id="route-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Ex: Rota Centro — Turno Noite"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-wp" className="text-xs">
                Máx. waypoints
              </Label>
              <Input
                id="max-wp"
                type="number"
                min={2}
                max={20}
                value={form.maxWaypoints}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxWaypoints: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Lat. viatura</Label>
                <Input
                  type="number"
                  placeholder="-8.33"
                  value={form.vehicleLatitude}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      vehicleLatitude: e.target.value,
                    }))
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Lng. viatura</Label>
                <Input
                  type="number"
                  placeholder="-36.42"
                  value={form.vehicleLongitude}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      vehicleLongitude: e.target.value,
                    }))
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <Button
              className="w-full h-8 text-sm"
              onClick={() => void handleGenerate()}
              disabled={generating || !form.name.trim()}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Route className="h-4 w-4 mr-2" />
              )}
              {generating ? "Gerando…" : "Gerar rota"}
            </Button>
          </div>

          {/* Lista de rotas */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">
                Rotas salvas ({routes.length})
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : routes.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                Nenhuma rota gerada ainda.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {routes.map((route) => (
                  <li key={route.id}>
                    <button
                      onClick={() => setSelected(route)}
                      className={`w-full text-left px-4 py-3 transition-colors hover:bg-accent/50 ${
                        selected?.id === route.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {route.name}
                        </span>
                        <Badge
                          variant={STATUS_VARIANT[route.status]}
                          className="text-[10px] shrink-0"
                        >
                          {STATUS_LABEL[route.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {route.waypoints.length} pontos
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(route.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Coluna direita — mapa + detalhes */}
        <div className="lg:col-span-2 space-y-4">
          {selected ? (
            <>
              {/* Mapa */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">
                    {selected.name}
                  </h3>
                  <Badge variant={STATUS_VARIANT[selected.status]}>
                    {STATUS_LABEL[selected.status]}
                  </Badge>
                </div>
                <PatrolRouteMap waypoints={selected.waypoints} />
              </div>

              {/* Ações de status + metadados */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-3">
                <h4 className="text-sm font-semibold">Ações</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        void handleStatus(selected.id, "IN_PROGRESS")
                      }
                    >
                      <Play className="h-3 w-3 mr-1" /> Iniciar patrulha
                    </Button>
                  )}
                  {selected.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void handleStatus(selected.id, "COMPLETED")
                      }
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Concluir
                    </Button>
                  )}
                  {(selected.status === "PENDING" ||
                    selected.status === "IN_PROGRESS") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        void handleStatus(selected.id, "CANCELLED")
                      }
                    >
                      <XCircle className="h-3 w-3 mr-1" /> Cancelar
                    </Button>
                  )}
                </div>

                {/* Waypoints table */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Waypoints ({selected.waypoints.length})
                  </p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">#</th>
                          <th className="px-3 py-2 text-left font-medium">
                            Latitude
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Longitude
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Risco
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selected.waypoints.map((wp, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="px-3 py-2 font-mono">{i + 1}</td>
                            <td className="px-3 py-2 font-mono">
                              {wp.latitude.toFixed(4)}
                            </td>
                            <td className="px-3 py-2 font-mono">
                              {wp.longitude.toFixed(4)}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`font-semibold ${
                                  wp.riskScore >= 6
                                    ? "text-red-500"
                                    : wp.riskScore >= 3
                                      ? "text-amber-500"
                                      : "text-emerald-500"
                                }`}
                              >
                                {wp.riskScore.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Logs */}
                {selected.logs && selected.logs.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Histórico
                    </p>
                    <ul className="space-y-1">
                      {selected.logs.map((log) => (
                        <li key={log.id} className="text-xs flex gap-2">
                          <span className="text-muted-foreground shrink-0">
                            {new Date(log.createdAt).toLocaleString("pt-BR")}
                          </span>
                          <span className="font-medium">{log.event}</span>
                          {log.metadata && (
                            <span className="text-muted-foreground truncate">
                              {log.metadata}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col items-center justify-center h-[420px] gap-3 text-muted-foreground">
              <Route className="h-10 w-10 opacity-30" />
              <p className="text-sm">
                Gere ou selecione uma rota para visualizar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
