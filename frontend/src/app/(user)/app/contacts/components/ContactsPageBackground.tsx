export function ContactsPageBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(216, 191, 122, 0.78) 0 18%, rgba(36, 75, 122, 0.82) 18% 76%, rgba(47, 107, 87, 0.72) 76% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(36, 75, 122, 0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.06) 38%, transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-12 top-12 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(36, 75, 122, 0.08)" }}
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(47, 107, 87, 0.06)" }}
      />
    </>
  );
}
