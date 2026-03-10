import { govTheme } from "@/components/landing/gov-theme";
import { AggressorForm } from "@/presentation/components/forms/aggressor-form";

export default function CreateAggressorPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <AggressorForm />
    </div>
  );
}
