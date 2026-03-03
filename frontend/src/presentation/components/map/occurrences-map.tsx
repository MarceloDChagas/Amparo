"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Occurrence } from "@/services/occurrence-service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// A component to render the Heatmap layer using Leaflet.heat
function HeatmapLayer({ occurrences }: { occurrences: Occurrence[] }) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    // Only import the heatmap plugin on the client
    import("leaflet.heat")
      .then(() => {
        // Map occurrences to [lat, lng, intensity]
        const points = occurrences
          .filter((o) => o.latitude != null && o.longitude != null)
          .map((o) => [o.latitude, o.longitude, 1] as [number, number, number]);

        if (points.length > 0) {
          if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          heatLayerRef.current = (L as any)
            .heatLayer(points, {
              radius: 25,
              blur: 15,
              maxZoom: 17,
              gradient: {
                0.4: "blue",
                0.6: "cyan",
                0.7: "lime",
                0.8: "yellow",
                1.0: "red",
              },
            })
            .addTo(map);
        }
        return null;
      })
      .catch((err) => {
        console.error("Failed to load leaflet.heat plugin", err);
      });

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, occurrences]);

  return null;
}

interface OccurrencesMapProps {
  occurrences: Occurrence[];
  viewMode: "cluster" | "heatmap";
}

export default function OccurrencesMap({
  occurrences,
  viewMode,
}: OccurrencesMapProps) {
  // Center roughly on Brazil or a default center if no data
  const center: [number, number] =
    occurrences.length > 0 &&
    occurrences[0].latitude &&
    occurrences[0].longitude
      ? [occurrences[0].latitude, occurrences[0].longitude]
      : [-14.235, -51.925]; // Brazil approx center

  return (
    <div className="h-[600px] w-full rounded-md border shadow-sm overflow-hidden z-0 relative">
      <MapContainer
        center={center}
        zoom={occurrences.length > 0 ? 12 : 4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {viewMode === "cluster" && (
          <MarkerClusterGroup chunkedLoading>
            {occurrences.map((occ) => {
              if (occ.latitude == null || occ.longitude == null) return null;
              return (
                <Marker key={occ.id} position={[occ.latitude, occ.longitude]}>
                  <Popup>
                    <div className="p-2 space-y-2">
                      <h3 className="font-bold text-sm">Ocorrência</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {occ.description}
                      </p>
                      <div className="text-xs">
                        <strong>Lat:</strong> {occ.latitude.toFixed(4)} <br />
                        <strong>Lng:</strong> {occ.longitude.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {viewMode === "heatmap" && <HeatmapLayer occurrences={occurrences} />}
      </MapContainer>
    </div>
  );
}
