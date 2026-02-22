"use client";

import { Activity, CheckCircle2, Info, Navigation } from "lucide-react";

import { AlertEvent } from "@/services/emergency-alert-service";

interface AlertTimelineProps {
  events: AlertEvent[];
}

export function AlertTimeline({ events }: AlertTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-gray-400 text-sm py-4">
        Nenhum evento registrado no prontuário.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return <Activity size={16} className="text-red-500" />;
      case "NOTIFICATION_SENT":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "LOCATION_UPDATE":
        return <Navigation size={16} className="text-blue-500" />;
      default:
        return <Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 relative">
          {/* Vertical line connecting timeline items */}
          {index < events.length - 1 && (
            <div className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-gray-800" />
          )}

          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center z-10 relative">
              {getIcon(event.type)}
            </div>
          </div>

          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-white">{event.message}</span>
              <span className="text-xs text-gray-500 font-mono">
                {new Date(event.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div className="text-xs text-gray-400 flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono">
                {event.source}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono">
                {event.type}
              </span>
            </div>

            {event.metadata && (
              <div className="mt-3 text-xs bg-black/50 p-2 rounded border border-gray-800 font-mono text-gray-500 break-all">
                {event.metadata}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
