interface SocialMetaProps {
  title: string;
  description: string;
}

export function SocialMeta({ title, description }: SocialMetaProps) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Amparo" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
