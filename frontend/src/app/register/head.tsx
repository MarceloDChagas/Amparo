import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Criar Conta | Amparo";
  const description =
    "Solicite acesso ao sistema institucional do Amparo e integre sua equipe aos fluxos autorizados.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
