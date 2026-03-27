"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { HeatMapCell } from "@/services/heat-map-service";
import { Occurrence } from "@/services/occurrence-service";

// ── Ícones customizados (AM-163: melhorar visual da marcação) ────────────────

function makeIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    tooltipAnchor: [14, -18],
  });
}

const ICON_RED = makeIcon("#dc2626");    // ocorrência com agressor conhecido
const ICON_AMBER = makeIcon("#d97706");  // ocorrência recente (≤ 30 dias), sem agressor
const ICON_BLUE = makeIcon("#2563eb");   // ocorrência antiga, sem agressor

function chooseIcon(occ: Occurrence): L.DivIcon {
  if (occ.aggressorId) return ICON_RED;
  if (occ.createdAt) {
    const age = Date.now() - new Date(occ.createdAt).getTime();
    const days30 = 30 * 24 * 60 * 60 * 1000;
    if (age <= days30) return ICON_AMBER;
  }
  return ICON_BLUE;
}

// ── Legenda ──────────────────────────────────────────────────────────────────

function MapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        right: 10,
        zIndex: 1000,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Legenda</div>
      {[
        { color: "#dc2626", label: "Agressor identificado" },
        { color: "#d97706", label: "Recente (≤ 30 dias)" },
        { color: "#2563eb", label: "Demais ocorrências" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Camada de Heatmap ────────────────────────────────────────────────────────

interface HeatmapLayerProps {
  occurrences: Occurrence[];
  heatMapCells?: HeatMapCell[];
}

function HeatmapLayer({ occurrences, heatMapCells }: HeatmapLayerProps) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    import("leaflet.heat")
      .then(() => {
        let points: [number, number, number][];

        if (heatMapCells && heatMapCells.length > 0) {
          // AM-149/AM-151: usa células com riskScore real da API
          const maxScore = Math.max(...heatMapCells.map((c) => c.riskScore), 1);
          points = heatMapCells
            .filter((c) => c.latitude != null && c.longitude != null)
            .map((c) => [c.latitude, c.longitude, c.riskScore / maxScore] as [number, number, number]);
        } else {
          // fallback: se o heat map ainda não foi calculado, usa ocorrências brutas
          points = occurrences
            .filter((o) => o.latitude != null && o.longitude != null)
            .map((o) => [o.latitude, o.longitude, 1] as [number, number, number]);
        }

        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
        }

        if (points.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          heatLayerRef.current = (L as any)
            .heatLayer(points, {
              radius: 30,
              blur: 20,
              maxZoom: 17,
              max: 1.0,
              gradient: {
                0.2: "#3b82f6",
                0.4: "#06b6d4",
                0.6: "#84cc16",
                0.75: "#eab308",
                0.9: "#ef4444",
                1.0: "#7f1d1d",
              },
            })
            .addTo(map);
        }
      })
      .catch((err) => {
        console.error("Failed to load leaflet.heat plugin", err);
      });

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, occurrences, heatMapCells]);

  return null;
}

// ── Sincroniza centro/zoom ───────────────────────────────────────────────────

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// ── Componente principal ─────────────────────────────────────────────────────

interface OccurrencesMapProps {
  occurrences: Occurrence[];
  viewMode: "cluster" | "heatmap";
  heatMapCells?: HeatMapCell[];
}

export default function OccurrencesMap({
  occurrences,
  viewMode,
  heatMapCells,
}: OccurrencesMapProps) {
  const [center, setCenter] = useState<[number, number]>([-14.235, -51.925]);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(13);
        },
        () => {
          if (occurrences.length > 0 && occurrences[0].latitude && occurrences[0].longitude) {
            setCenter([occurrences[0].latitude, occurrences[0].longitude]);
            setZoom(12);
          }
        },
      );
    } else if (occurrences.length > 0 && occurrences[0].latitude && occurrences[0].longitude) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCenter([occurrences[0].latitude, occurrences[0].longitude]);
      setZoom(12);
    }
  }, [occurrences]);

  return (
    <div className="h-[600px] w-full rounded-md border shadow-sm overflow-hidden z-0 relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* AM-163: marcadores coloridos + AM-164: tooltip ao passar o mouse */}
        {viewMode === "cluster" && (
          <>
            <MarkerClusterGroup chunkedLoading>
              {occurrences.map((occ) => {
                if (occ.latitude == null || occ.longitude == null) return null;
                const icon = chooseIcon(occ);
                return (
                  <Marker key={occ.id} position={[occ.latitude, occ.longitude]} icon={icon}>
                    {/* AM-164: detalhamento ao passar o mouse */}
                    <Tooltip direction="top" offset={[0, -32]} opacity={0.95}>
                      <div style={{ minWidth: 160, fontSize: 12 }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>Ocorrência</p>
                        <p style={{ color: "#6b7280", marginBottom: 2 }}>{occ.description}</p>
                        {occ.createdAt && (
                          <p style={{ color: "#9ca3af" }}>
                            {new Date(occ.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                        {occ.aggressorId && (
                          <p style={{ color: "#dc2626", marginTop: 2 }}>Agressor identificado</p>
                        )}
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="p-1 space-y-1.5">
                        <h3 className="font-bold text-sm">Ocorrência</h3>
                        <p className="text-xs text-muted-foreground">{occ.description}</p>
                        <div className="text-xs space-y-0.5">
                          <div><strong>Lat:</strong> {occ.latitude.toFixed(5)}</div>
                          <div><strong>Lng:</strong> {occ.longitude.toFixed(5)}</div>
                          {occ.createdAt && (
                            <div>
                              <strong>Data:</strong>{" "}
                              {new Date(occ.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          )}
                          {occ.aggressorId && (
                            <div className="text-red-600 font-medium">Agressor identificado</div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
            <MapLegend />
          </>
        )}

        {viewMode === "heatmap" && (
          <HeatmapLayer occurrences={occurrences} heatMapCells={heatMapCells} />
        )}
      </MapContainer>
    </div>
  );
}
