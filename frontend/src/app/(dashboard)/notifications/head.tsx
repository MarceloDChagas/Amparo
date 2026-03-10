import { SocialMeta } from "@/app/social-meta";

export default function Head() {
  const title = "Notificações | Amparo";
  const description =
    "Gerencie notificações institucionais e comunicações enviadas pela plataforma Amparo.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <SocialMeta title={title} description={description} />
    </>
  );
}
