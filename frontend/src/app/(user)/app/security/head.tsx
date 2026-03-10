import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Perfil e Segurança | Amparo";
  const description =
    "Consulte seus dados de acesso e acione recursos de segurança no Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
