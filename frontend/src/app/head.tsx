import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Amparo | Plataforma Institucional";
  const description =
    "Sistema institucional do Amparo para acolhimento, acompanhamento e coordenação entre serviços autorizados.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
