import { ShieldCheck, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AuthShellProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  shieldText: string;
  formTitle: string;
  formDescription: string;
  footerPrompt: string;
  footerHref: string;
  footerLinkLabel: string;
  children: React.ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  shieldText,
  formTitle,
  formDescription,
  footerPrompt,
  footerHref,
  footerLinkLabel,
  children,
}: AuthShellProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36, 75, 122, 0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31, 58, 95, 0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      {/* NRF10 — barra decorativa do cabeçalho, sem conteúdo semântico */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(216, 191, 122, 0.78) 0 18%, rgba(36, 75, 122, 0.82) 18% 76%, rgba(47, 107, 87, 0.72) 76% 100%)",
        }}
      />

      {/* NRF10 — grid decorativo, sem conteúdo semântico */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(36, 75, 122, 0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.06) 38%, transparent 72%)",
        }}
      />

      {/* NRF10 — blobs decorativos */}
      <div
        aria-hidden="true"
        className="absolute -right-16 top-10 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(36, 75, 122, 0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 bottom-0 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(47, 107, 87, 0.06)" }}
      />

      <div className="relative mx-auto grid min-h-screen max-w-[1180px] gap-10 px-6 py-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center lg:gap-12 lg:px-8 lg:py-10 xl:gap-16">
        <section className="hidden flex-col justify-center lg:flex lg:min-h-136">
          <div className="h-6" aria-hidden="true" />

          <div className="mt-10 max-w-[30rem]">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground bg-accent"
              style={{ borderColor: "var(--ring)" }}
            >
              <UserRoundCheck size={14} />
              {eyebrow}
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight lg:text-[3.1rem] lg:leading-[1.06] text-foreground">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>
            <div
              className="mt-8 inline-flex max-w-md items-center gap-3 rounded-[20px] border px-4 py-3.5 shadow-sm"
              style={{
                borderColor: "rgba(168, 184, 203, 0.65)",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            >
              <ShieldCheck
                size={18}
                className="shrink-0"
                style={{ color: "var(--chart-2)" }}
              />
              <p className="text-sm leading-6 text-muted-foreground">
                {shieldText}
              </p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center lg:justify-end">
          <div
            className="w-full max-w-[36rem] rounded-[24px] border border-border p-8 sm:p-10 lg:p-11"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,253,0.98) 100%)",
              boxShadow:
                "0 20px 60px rgba(15, 23, 42, 0.08), 0 2px 12px rgba(36, 75, 122, 0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
                aria-label="Página inicial do Amparo"
              >
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent"
                >
                  <ShieldCheck size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Serviço público de proteção
                  </p>
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    Amparo
                  </span>
                </div>
              </Link>

              <h2 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
                {formTitle}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {formDescription}
              </p>
            </div>

            {children}

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">{footerPrompt} </span>
              <Link
                href={footerHref}
                className="font-semibold underline decoration-transparent underline-offset-4 transition-all hover:decoration-current hover:opacity-90 text-accent-foreground"
              >
                {footerLinkLabel}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
