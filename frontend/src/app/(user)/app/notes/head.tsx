import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Minhas Notas | Amparo";
  const description =
    "Acompanhe e registre suas notas pessoais no ambiente protegido do Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
