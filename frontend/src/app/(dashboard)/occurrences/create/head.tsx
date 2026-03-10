import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Nova Ocorrência | Amparo";
  const description =
    "Converta um alerta em ocorrência e registre uma nova avaliação no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
