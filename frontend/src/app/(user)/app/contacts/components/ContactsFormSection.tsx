import { Plus } from "lucide-react";

import { govTheme } from "@/components/landing/gov-theme";
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
      <div className="mb-5 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: govTheme.brand.blueSurface }}
        >
          <Plus size={16} style={{ color: govTheme.brand.blue }} />
        </div>
        <h3
          className="text-base font-semibold"
          style={{ color: govTheme.text.primary }}
        >
          Adicionar contato
        </h3>
      </div>

      <EmergencyContactForm />
    </div>
  );
}
