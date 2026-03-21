export function CheckInInstructionalCard() {
  return (
    <div
      className="w-full max-w-md rounded-3xl px-5 py-4 mb-6 backdrop-blur-sm shadow-md"
      style={{
        backgroundColor: "rgba(15, 118, 110, 0.22)",
        border: "1px solid rgba(45, 212, 191, 0.18)",
        marginTop: "20px",
      }}
    >
      <p className="text-white/85 text-center text-sm leading-relaxed">
        Selecione o tempo estimado e marque a sua saída. O sistema acompanhará o
        seu trajeto de forma invisível. Caso não registre sua chegada dentro da
        tolerância de tempo prevista, nós avisaremos os seus contatos de
        emergência e enviaremos a sua última localização conhecida.
      </p>
    </div>
  );
}
