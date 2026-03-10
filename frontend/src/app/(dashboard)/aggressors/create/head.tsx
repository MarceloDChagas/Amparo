import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Novo Agressor | Amparo";
  const description =
    "Cadastre um novo agressor no sistema institucional do Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
