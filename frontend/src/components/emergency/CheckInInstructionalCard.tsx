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
        Informe o tempo estimado e inicie o trajeto. Se você não confirmar a
        chegada no prazo, seus contatos serão avisados automaticamente.
      </p>
    </div>
  );
}
