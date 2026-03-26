import { EmergencyContactForm } from "@/presentation/components/forms/emergency-contact-form";

export function ContactsFormSection() {
  return (
    <div
      className="rounded-[24px] border p-5 sm:p-7"
      style={{
        borderColor: "rgba(180,140,160,0.30)",
        backgroundColor: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px rgba(58,37,48,0.07)",
      }}
    >
      <h3 className="mb-5 text-base font-semibold" style={{ color: "#3a2530" }}>
        Adicionar contato
      </h3>

      <EmergencyContactForm />
    </div>
  );
}
