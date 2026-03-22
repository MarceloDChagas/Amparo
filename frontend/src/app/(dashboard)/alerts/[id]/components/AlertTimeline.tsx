"use client";

import {
  Activity,
  ArrowRightCircle,
  CheckCircle2,
  Info,
  Navigation,
} from "lucide-react";

import { AlertEvent } from "@/services/emergency-alert-service";

interface AlertTimelineProps {
  events: AlertEvent[];
}

export function AlertTimeline({ events }: AlertTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-4 text-sm text-muted-foreground">
        Nenhum evento registrado no prontuário.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return <Activity size={16} className="text-destructive" />;
      case "NOTIFICATION_SENT":
        return <CheckCircle2 size={16} style={{ color: "var(--chart-2)" }} />;
      case "LOCATION_UPDATE":
        return <Navigation size={16} className="text-primary" />;
      case "STATUS_CHANGE":
        return <ArrowRightCircle size={16} className="text-blue-500" />;
      default:
        return <Info size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 relative">
          {index < events.length - 1 && (
            <div className="absolute bottom-[-16px] left-4 top-8 w-[2px] bg-border" />
          )}

          <div className="flex-shrink-0 mt-1">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary">
              {getIcon(event.type)}
            </div>
          </div>

          <div className="flex-1 rounded-lg border border-border p-4 bg-secondary">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-foreground">
                {event.message}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {new Date(event.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded border border-border px-2 py-0.5 font-mono bg-card">
                {event.source}
              </span>
              <span>•</span>
              <span className="rounded border border-border px-2 py-0.5 font-mono bg-card">
                {event.type}
              </span>
            </div>

            {event.metadata && (
              <div className="mt-3 break-all rounded border border-border p-2 font-mono text-xs text-muted-foreground bg-card">
                {event.metadata}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
