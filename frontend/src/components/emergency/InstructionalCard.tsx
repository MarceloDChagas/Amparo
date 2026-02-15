import React from "react";

export function InstructionalCard() {
  return (
    <div
      className="w-full max-w-md rounded-3xl p-6 mb-6 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(61, 61, 106, 0.7)",
        marginTop: "20px",
      }}
    >
      <p className="text-white text-center text-sm leading-relaxed">
        Pressione o botão de ajuda para enviar uma mensagem de alerta gratuita
        com sua localização para seus contatos de emergência e avisá-los que
        você está em perigo.
      </p>
    </div>
  );
}
