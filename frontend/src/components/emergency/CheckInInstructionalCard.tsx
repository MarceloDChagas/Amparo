export function CheckInInstructionalCard() {
  return (
    <div
      className="w-full max-w-md rounded-3xl px-5 py-4 mb-6 backdrop-blur-sm shadow-md"
      style={{
        backgroundColor: "rgba(255,255,255,0.50)",
        border: "1px solid rgba(122,181,160,0.25)",
        marginTop: "20px",
      }}
    >
      <p
        className="text-center text-sm leading-relaxed"
        style={{ color: "#7a5565" }}
      >
        Informe o tempo estimado e inicie o trajeto. Se você não confirmar a
        chegada no prazo, seus contatos serão avisados automaticamente.
      </p>
    </div>
  );
}
