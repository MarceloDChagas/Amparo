import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Detalhes do Alerta | Amparo";
  const description =
    "Acompanhe os detalhes e o contexto de um alerta de emergência no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
