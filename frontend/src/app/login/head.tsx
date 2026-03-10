import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Entrar | Amparo";
  const description =
    "Acesse sua conta institucional do Amparo para acompanhar atendimentos e casos autorizados.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
