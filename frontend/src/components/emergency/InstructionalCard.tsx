import React from "react";

export function InstructionalCard() {
  return (
    <div
      className="mb-4 w-full max-w-sm rounded-2xl p-4 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(61, 61, 106, 0.7)",
        marginTop: "12px",
      }}
    >
      <div className="text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          Cuidado contínuo
        </p>
      </div>
    </div>
  );
}
