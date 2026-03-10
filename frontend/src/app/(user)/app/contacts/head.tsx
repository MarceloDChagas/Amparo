import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Contatos de Emergência | Amparo";
  const description =
    "Gerencie os contatos de emergência associados ao seu acompanhamento no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
