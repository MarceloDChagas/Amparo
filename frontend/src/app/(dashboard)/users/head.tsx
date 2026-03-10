import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Usuários | Amparo";
  const description =
    "Gerencie os usuários e perfis de acesso da plataforma institucional Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
