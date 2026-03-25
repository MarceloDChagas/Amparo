import { EmergencyContactForm } from "@/presentation/components/forms/emergency-contact-form";

export function ContactsFormSection() {
  return (
    <div
      className="rounded-[24px] border p-5 sm:p-7"
      style={{
        borderColor: "#bfd0e0",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
      }}
    >
      <h3
        className="mb-5 text-base font-semibold"
        style={{ color: "#1f2937" }}
      >
        Adicionar contato
      </h3>

      <EmergencyContactForm />
    </div>
  );
}
