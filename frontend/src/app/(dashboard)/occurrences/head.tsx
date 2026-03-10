import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Ocorrências | Amparo";
  const description =
    "Visualize e acompanhe as ocorrências registradas na plataforma Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
