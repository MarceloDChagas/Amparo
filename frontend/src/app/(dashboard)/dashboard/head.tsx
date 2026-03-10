import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Painel | Amparo";
  const description =
    "Visualize indicadores, alertas e atividade recente no painel institucional do Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
