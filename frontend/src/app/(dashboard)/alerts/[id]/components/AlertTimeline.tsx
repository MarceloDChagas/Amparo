"use client";

import { Activity, CheckCircle2, Info, Navigation } from "lucide-react";

import { govTheme } from "@/components/landing/gov-theme";
import { AlertEvent } from "@/services/emergency-alert-service";

interface AlertTimelineProps {
  events: AlertEvent[];
}

export function AlertTimeline({ events }: AlertTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-4 text-sm" style={{ color: govTheme.text.secondary }}>
        Nenhum evento registrado no prontuário.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return <Activity size={16} style={{ color: govTheme.status.danger }} />;
      case "NOTIFICATION_SENT":
        return (
          <CheckCircle2 size={16} style={{ color: govTheme.brand.green }} />
        );
      case "LOCATION_UPDATE":
        return <Navigation size={16} style={{ color: govTheme.brand.blue }} />;
      default:
        return <Info size={16} style={{ color: govTheme.text.muted }} />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 relative">
          {index < events.length - 1 && (
            <div
              className="absolute bottom-[-16px] left-4 top-8 w-[2px]"
              style={{ backgroundColor: govTheme.border.subtle }}
            />
          )}

          <div className="flex-shrink-0 mt-1">
            <div
              className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border"
              style={{
                backgroundColor: govTheme.background.alt,
                borderColor: govTheme.border.subtle,
              }}
            >
              {getIcon(event.type)}
            </div>
          </div>

          <div
            className="flex-1 rounded-lg border p-4"
            style={{
              backgroundColor: govTheme.background.alt,
              borderColor: govTheme.border.subtle,
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className="font-semibold"
                style={{ color: govTheme.text.primary }}
              >
                {event.message}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: govTheme.text.muted }}
              >
                {new Date(event.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div
              className="mt-2 flex items-center gap-2 text-xs"
              style={{ color: govTheme.text.secondary }}
            >
              <span
                className="rounded border px-2 py-0.5 font-mono"
                style={{
                  backgroundColor: govTheme.background.section,
                  borderColor: govTheme.border.subtle,
                }}
              >
                {event.source}
              </span>
              <span>•</span>
              <span
                className="rounded border px-2 py-0.5 font-mono"
                style={{
                  backgroundColor: govTheme.background.section,
                  borderColor: govTheme.border.subtle,
                }}
              >
                {event.type}
              </span>
            </div>

            {event.metadata && (
              <div
                className="mt-3 break-all rounded border p-2 font-mono text-xs"
                style={{
                  color: govTheme.text.muted,
                  backgroundColor: govTheme.background.section,
                  borderColor: govTheme.border.subtle,
                }}
              >
                {event.metadata}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
