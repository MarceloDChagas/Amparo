import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Mensagens | Amparo";
  const description =
    "Consulte avisos, retornos e mensagens importantes do seu acompanhamento no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
