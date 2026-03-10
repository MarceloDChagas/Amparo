import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Detalhes do Check-in | Amparo";
  const description =
    "Veja o histórico e as informações de um check-in monitorado pelo Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
