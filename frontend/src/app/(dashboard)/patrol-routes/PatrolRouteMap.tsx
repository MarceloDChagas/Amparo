"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef } from "react";

import { Waypoint } from "@/services/patrol-route-service";

interface Props {
  waypoints: Waypoint[];
}

function riskColor(score: number): string {
  if (score >= 6) return "#ef4444";
  if (score >= 3) return "#f59e0b";
  return "#10b981";
}

export default function PatrolRouteMap({ waypoints }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || waypoints.length === 0) return;

    // Destroys any previous instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const sorted = [...waypoints].sort((a, b) => a.order - b.order);
    const latlngs: [number, number][] = sorted.map((wp) => [
      wp.latitude,
      wp.longitude,
    ]);

    const map = L.map(containerRef.current, { preferCanvas: true }).setView(
      latlngs[0],
      14,
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.polyline(latlngs, {
      color: "#6366f1",
      weight: 3,
      dashArray: "6,4",
    }).addTo(map);

    sorted.forEach((wp, i) => {
      const color = riskColor(wp.riskScore);
      const icon = L.divIcon({
        html: `<div style="background:${color};color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)">${i + 1}</div>`,
        className: "",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      L.marker([wp.latitude, wp.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<b>Ponto ${i + 1}</b><br/>Risco: <b>${wp.riskScore.toFixed(1)}</b><br/>${wp.latitude.toFixed(5)}, ${wp.longitude.toFixed(5)}`,
        );
    });

    if (latlngs.length > 1) {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [waypoints]);

  if (waypoints.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        Sem waypoints para exibir
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: 360, borderRadius: "0.5rem", overflow: "hidden" }}
    />
  );
}
