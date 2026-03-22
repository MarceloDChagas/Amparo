import { EmergencyContactForm } from "@/presentation/components/forms/emergency-contact-form";

export function ContactsFormSection() {
  return (
    <div
      className="rounded-[24px] border p-5 sm:p-7"
      style={{
        borderColor: "#bfd0e0",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,253,0.98) 100%)",
        boxShadow:
          "0 20px 60px rgba(15, 23, 42, 0.08), 0 2px 12px rgba(36, 75, 122, 0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h3 className="mb-5 text-base font-semibold text-foreground">
        Adicionar contato
      </h3>

      <EmergencyContactForm />
    </div>
  );
}
