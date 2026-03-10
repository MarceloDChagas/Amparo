import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Detalhes do Usuário | Amparo";
  const description =
    "Consulte os dados, documentos e anotações de um usuário no sistema Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
