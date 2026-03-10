import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Agressores | Amparo";
  const description =
    "Consulte e gerencie os registros de agressores vinculados ao sistema Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
