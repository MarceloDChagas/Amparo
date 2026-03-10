import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Meu Acompanhamento | Amparo";
  const description =
    "Acompanhe sua rede de proteção, documentos e informações pessoais no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
