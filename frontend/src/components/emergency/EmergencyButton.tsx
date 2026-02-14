import React, { useState } from "react";

import { useCreateEmergencyAlert } from "@/hooks/use-emergency-alert";
import { colors } from "@/styles/colors";

export function EmergencyButton() {
  const [isPressing, setIsPressing] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const { mutate: createAlert, isPending } = useCreateEmergencyAlert();

  const handlePressStart = () => {
    setIsPressing(true);
    setShowPulse(true);
    handleEmergency();
  };

  const handlePressEnd = () => {
    setIsPressing(false);
  };

  const handleEmergency = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // TODO: Remove hardcoded victimId after auth implementation
        createAlert({
          latitude,
          longitude,
          victimId: "94d57aca-a2cc-4d46-aa10-37a8010c55ef",
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        // Fallback or error handling
        createAlert({ latitude: 0, longitude: 0 }); // Send alert even without precise location? Or maybe ask user.
        // For now, let's send 0,0 or handle error.
        // Better to send what we have.
      },
    );
  };

  return (
    <div
      className="relative mb-8 flex items-center justify-center"
      style={{ width: "280px", height: "280px" }}
    >
      {/* Pulse waves animation */}
      {showPulse && (
        <>
          <div
            className="absolute rounded-full animate-pulse-wave"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(255, 179, 217, 0.6)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWave 1.5s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(255, 179, 217, 0.4)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWave 1.5s ease-out 0.3s infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(255, 179, 217, 0.2)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWave 1.5s ease-out 0.6s infinite",
            }}
          />
        </>
      )}

      {/* Outer ring - darkest */}
      <div
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "280px",
          height: "280px",
          backgroundColor: "#3d3d6a",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
          boxShadow: isPressing ? "0 0 30px rgba(255, 179, 217, 0.5)" : "none",
        }}
      />

      {/* Middle ring - purple */}
      <div
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "220px",
          height: "220px",
          backgroundColor: "#6b5b7b",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
        }}
      />

      {/* Inner circle - pink */}
      <button
        className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl"
        style={{
          width: "170px",
          height: "170px",
          backgroundColor: colors.secondary[300],
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
          boxShadow: isPressing
            ? "0 0 40px rgba(255, 179, 217, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.1)"
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <span
          className="text-4xl font-bold leading-tight text-center transition-all duration-300"
          style={{
            color: colors.primary[900],
            textShadow: isPressing
              ? "0 0 10px rgba(255, 255, 255, 0.5)"
              : "none",
          }}
        >
          PUSH
        </span>
      </button>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes pulseWave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
