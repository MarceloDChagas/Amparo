export function CheckInInstructionalCard() {
  return (
    <div
      className="w-full max-w-md rounded-3xl p-6 mb-6 backdrop-blur-sm shadow-md"
      style={{
        backgroundColor: "rgba(61, 61, 106, 0.7)",
        marginTop: "20px",
      }}
    >
      <p className="text-white text-center text-sm leading-relaxed">
        Selecione o tempo estimado e marque a sua saída. O sistema acompanhará o
        seu trajeto de forma invisível. Caso não registre sua chegada dentro da
        tolerância de tempo prevista, nós avisaremos os seus contatos de
        emergência e enviaremos a sua última localização conhecida.
      </p>
    </div>
  );
}
