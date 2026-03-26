export function ContactsPageBackground() {
  return (
    <>
      {/* Faixa decorativa superior — salmão → lavanda → verde água */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(196,112,90,0.7) 0 30%, rgba(180,140,200,0.65) 30% 70%, rgba(122,181,160,0.65) 70% 100%)",
        }}
      />
      {/* Glow salmão canto direito */}
      <div
        className="pointer-events-none absolute -right-12 top-12 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(196,112,90,0.10)" }}
      />
      {/* Glow verde água canto esquerdo inferior */}
      <div
        className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(122,181,160,0.10)" }}
      />
    </>
  );
}
