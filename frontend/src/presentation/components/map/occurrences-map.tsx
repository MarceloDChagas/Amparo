"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { HeatMapCell } from "@/services/heat-map-service";
import { Occurrence } from "@/services/occurrence-service";

// ── Limiares ─────────────────────────────────────────────────────────────────
// Acima deste zoom o heatmap cede lugar aos markers individuais
const CLUSTER_ZOOM_THRESHOLD = 14;

// ── Pesos de severidade ───────────────────────────────────────────────────────
// Agressor identificado > recente sem agressor > demais
function occurrenceWeight(occ: Occurrence): number {
  if (occ.aggressorId) return 2.0;
  if (occ.createdAt) {
    const age = Date.now() - new Date(occ.createdAt).getTime();
    if (age <= 30 * 24 * 60 * 60 * 1000) return 1.5;
  }
  return 1.0;
}

// ── Raio responsivo ao zoom ───────────────────────────────────────────────────
// Zoom baixo → borrão maior para mostrar tendência; zoom alto → pontos menores
function heatRadius(zoom: number): number {
  if (zoom <= 10) return 35;
  if (zoom <= 12) return 25;
  if (zoom <= 13) return 18;
  return 12;
}

function heatBlur(zoom: number): number {
  if (zoom <= 10) return 22;
  if (zoom <= 12) return 16;
  return 10;
}

// ── Ícones de markers ─────────────────────────────────────────────────────────
function makeIcon(color: string, size = 24) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.29)}" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z"
      fill="${color}" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, Math.round(size * 1.29)],
    iconAnchor: [size / 2, Math.round(size * 1.29)],
    popupAnchor: [0, -Math.round(size * 1.29)],
    tooltipAnchor: [size / 2, -Math.round(size * 0.65)],
  });
}

const ICON_RED = makeIcon("#ef4444");
const ICON_AMBER = makeIcon("#f59e0b");
const ICON_BLUE = makeIcon("#60a5fa");

function chooseIcon(occ: Occurrence) {
  if (occ.aggressorId) return ICON_RED;
  if (occ.createdAt) {
    const age = Date.now() - new Date(occ.createdAt).getTime();
    if (age <= 30 * 24 * 60 * 60 * 1000) return ICON_AMBER;
  }
  return ICON_BLUE;
}

// ── Legenda de markers ────────────────────────────────────────────────────────
function MarkerLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        right: 10,
        zIndex: 1000,
        background: "rgba(18,24,33,0.88)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 11.5,
        color: "#e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 7,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontSize: 10,
          color: "#9ca3af",
        }}
      >
        Legenda
      </div>
      {[
        { color: "#ef4444", label: "Agressor identificado" },
        { color: "#f59e0b", label: "Recente (≤ 30 dias)" },
        { color: "#60a5fa", label: "Demais ocorrências" },
      ].map(({ color, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Legenda de gradiente do heatmap ──────────────────────────────────────────
function HeatmapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        right: 10,
        zIndex: 1000,
        background: "rgba(18,24,33,0.88)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 11.5,
        color: "#e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 7,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontSize: 10,
          color: "#9ca3af",
        }}
      >
        Intensidade
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          marginBottom: 5,
          background:
            "linear-gradient(to right, #3b82f6, #06b6d4, #84cc16, #eab308, #ef4444, #7f1d1d)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#9ca3af",
        }}
      >
        <span>Baixa</span>
        <span>Moderada</span>
        <span>Alta</span>
      </div>
    </div>
  );
}

// ── Camada de heatmap (responde ao zoom para ajustar raio) ────────────────────
interface HeatmapLayerProps {
  points: [number, number, number][];
  zoom: number;
}

function HeatmapLayer({ points, zoom }: HeatmapLayerProps) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);

  const rebuild = useCallback(() => {
    if (!map || points.length === 0) return;
    void import("leaflet.heat").then(() => {
      if (layerRef.current) map.removeLayer(layerRef.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layerRef.current = (L as any)
        .heatLayer(points, {
          // promise/always-return: valor atribuído acima
          radius: heatRadius(zoom),
          blur: heatBlur(zoom),
          maxZoom: 17,
          max: 1.0,
          gradient: {
            0.15: "#3b82f6",
            0.35: "#06b6d4",
            0.55: "#84cc16",
            0.72: "#eab308",
            0.88: "#ef4444",
            1.0: "#7f1d1d",
          },
        })
        .addTo(map);
      return layerRef.current;
    });
  }, [map, points, zoom]);

  useEffect(() => {
    rebuild();
    return () => {
      if (layerRef.current && map) map.removeLayer(layerRef.current);
    };
  }, [rebuild, map]);

  return null;
}

// ── Observa mudanças de zoom e avisa o pai ────────────────────────────────────
function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoomChange(e.target.getZoom()) });
  return null;
}

// ── FlyTo quando o centro muda ────────────────────────────────────────────────
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// ── Time-slider ───────────────────────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Todos", days: 0 },
] as const;

// ── Componente principal ──────────────────────────────────────────────────────
interface OccurrencesMapProps {
  occurrences: Occurrence[];
  viewMode: "cluster" | "heatmap";
  heatMapCells?: HeatMapCell[];
}

export default function OccurrencesMap({
  occurrences,
  heatMapCells,
}: OccurrencesMapProps) {
  // Centro derivado das ocorrências via lazy init (evita useEffect+setState)
  const [center] = useState<[number, number]>(() => {
    const first = occurrences.find((o) => o.latitude && o.longitude);
    return first ? [first.latitude, first.longitude] : [-8.334, -36.425];
  });
  const [initZoom] = useState(13);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [selectedDays, setSelectedDays] = useState<number>(30);
  // now é estável no render — Date.now() não pode ser chamado diretamente em render (lint purity)
  const [now] = useState(() => Date.now());

  // Filtra por período
  const cutoff =
    selectedDays === 0 ? 0 : now - selectedDays * 24 * 60 * 60 * 1000;
  const filtered =
    cutoff === 0
      ? occurrences
      : occurrences.filter((o) => {
          if (!o.createdAt) return true;
          return new Date(o.createdAt).getTime() >= cutoff;
        });

  // Pontos do heatmap com pesos por severidade
  const heatPoints: [number, number, number][] = (() => {
    if (heatMapCells && heatMapCells.length > 0 && selectedDays === 0) {
      // Usa células pré-calculadas apenas no modo "Todos" (sem filtro temporal)
      const maxScore = Math.max(...heatMapCells.map((c) => c.riskScore), 1);
      return heatMapCells
        .filter((c) => c.latitude != null && c.longitude != null)
        .map((c) => [c.latitude, c.longitude, c.riskScore / maxScore]);
    }
    // Calcula ao vivo com pesos de severidade
    const max = Math.max(...filtered.map(occurrenceWeight), 1);
    return filtered
      .filter((o) => o.latitude != null && o.longitude != null)
      .map((o) => [o.latitude, o.longitude, occurrenceWeight(o) / max]);
  })();

  // Auto-switch: heatmap abaixo do limiar, cluster acima
  const showCluster = currentZoom >= CLUSTER_ZOOM_THRESHOLD;

  return (
    <div className="flex flex-col gap-3">
      {/* Time-slider como pílulas */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          Período:
        </span>
        {PERIOD_OPTIONS.map((o) => (
          <button
            key={o.label}
            onClick={() => setSelectedDays(o.days)}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            style={{
              borderColor:
                selectedDays === o.days ? "var(--primary)" : "var(--border)",
              backgroundColor:
                selectedDays === o.days ? "var(--primary)" : "transparent",
              color:
                selectedDays === o.days ? "white" : "var(--muted-foreground)",
            }}
          >
            {o.label}
          </button>
        ))}
        <span className="ml-auto flex items-baseline gap-2">
          <span
            className="text-5xl font-black tabular-nums leading-none"
            style={{ color: "var(--primary)" }}
          >
            {filtered.length}
          </span>
          <span className="text-sm text-muted-foreground">
            ocorrência{filtered.length !== 1 ? "s" : ""}
            <br />
            <span className="text-xs">
              {currentZoom >= CLUSTER_ZOOM_THRESHOLD
                ? "marcadores"
                : "mapa de calor"}
            </span>
          </span>
        </span>
      </div>

      {/* Mapa */}
      <div className="h-[560px] w-full rounded-xl overflow-hidden border border-border shadow-sm relative z-0">
        <MapContainer
          center={center}
          zoom={initZoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <MapUpdater center={center} zoom={initZoom} />
          <ZoomWatcher onZoomChange={setCurrentZoom} />

          {/* Dark base tile (CartoDB Dark Matter) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Heatmap — visível abaixo do limiar de zoom */}
          {!showCluster && heatPoints.length > 0 && (
            <HeatmapLayer points={heatPoints} zoom={currentZoom} />
          )}

          {/* Clusters — visível acima do limiar */}
          {showCluster && (
            <MarkerClusterGroup chunkedLoading>
              {filtered.map((occ) => {
                if (occ.latitude == null || occ.longitude == null) return null;
                return (
                  <Marker
                    key={occ.id}
                    position={[occ.latitude, occ.longitude]}
                    icon={chooseIcon(occ)}
                  >
                    <Tooltip direction="top" offset={[0, -28]} opacity={0.97}>
                      <div style={{ minWidth: 160, fontSize: 12 }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>
                          Ocorrência
                        </p>
                        <p
                          style={{
                            color: "#374151",
                            marginBottom: 2,
                            lineHeight: 1.4,
                          }}
                        >
                          {occ.description}
                        </p>
                        {occ.createdAt && (
                          <p style={{ color: "#6b7280" }}>
                            {new Date(occ.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        )}
                        {occ.aggressorId && (
                          <p
                            style={{
                              color: "#dc2626",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            ⚠ Agressor identificado
                          </p>
                        )}
                      </div>
                    </Tooltip>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>
                          Ocorrência
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#374151",
                            marginBottom: 6,
                            lineHeight: 1.5,
                          }}
                        >
                          {occ.description}
                        </p>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            lineHeight: 1.6,
                          }}
                        >
                          <div>
                            <strong>Lat:</strong> {occ.latitude.toFixed(5)}
                          </div>
                          <div>
                            <strong>Lng:</strong> {occ.longitude.toFixed(5)}
                          </div>
                          {occ.createdAt && (
                            <div>
                              <strong>Data:</strong>{" "}
                              {new Date(occ.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </div>
                          )}
                          {occ.aggressorId && (
                            <div
                              style={{
                                color: "#dc2626",
                                fontWeight: 600,
                                marginTop: 4,
                              }}
                            >
                              ⚠ Agressor identificado
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          )}

          {/* Legenda sobreposta */}
          {showCluster ? <MarkerLegend /> : <HeatmapLegend />}
        </MapContainer>
      </div>
    </div>
  );
}
