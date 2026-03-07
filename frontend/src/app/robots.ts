import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/admin',
          '/logg-inn',
          '/registrer',
          '/onboarding',
          '/abonnement',
        ],
      },
    ],
    sitemap: 'https://babypakka.no/sitemap.xml',
  };
}
