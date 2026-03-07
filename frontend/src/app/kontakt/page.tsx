import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Kontakt oss',
  description: 'Ta kontakt med Babypakka for spørsmål om babyutstyr, abonnement og levering. E-post: hei@babypakka.no.',
  keywords: ['kontakt babypakka', 'babyutstyr kundeservice', 'babypakka e-post'],
  openGraph: {
    title: 'Kontakt oss | Babypakka.no',
    description: 'Ta kontakt med Babypakka. Vi hjelper deg gjerne!',
    type: 'website',
    locale: 'nb_NO',
  },
  alternates: {
    canonical: '/kontakt',
  },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Babypakka',
    url: 'https://babypakka.no',
    email: 'hei@babypakka.no',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hei@babypakka.no',
      contactType: 'customer service',
      availableLanguage: 'Norwegian',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '16:00',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Oslo',
      addressCountry: 'NO',
    },
  },
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={contactJsonLd} />
      <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Kontakt oss</h1>
      <p className="mt-4 text-lg text-baby-text-light">
        Vi hjelper deg gjerne! Ta kontakt med oss, så svarer vi så raskt vi kan.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {/* E-post */}
        <div className="rounded-2xl bg-baby-warm p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-blue">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-baby-text">E-post</h2>
          <a
            href="mailto:hei@babypakka.no"
            className="mt-2 inline-block text-baby-blue hover:text-baby-blue-dark transition-colors"
          >
            hei@babypakka.no
          </a>
          <p className="mt-2 text-sm text-baby-text-light">
            Vi svarer normalt innen 1–2 virkedager.
          </p>
        </div>

        {/* Svartid */}
        <div className="rounded-2xl bg-baby-warm p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-sage">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-baby-text">Svartid</h2>
          <p className="mt-2 text-baby-text-light">
            Vi besvarer alle henvendelser innen 1–2 virkedager.
          </p>
          <p className="mt-2 text-sm text-baby-text-light">
            Mandag–fredag, 09:00–16:00
          </p>
        </div>

        {/* Adresse */}
        <div className="rounded-2xl bg-baby-warm p-6 sm:col-span-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-pink">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-baby-text">Adresse</h2>
          <p className="mt-2 text-baby-text-light">
            Babypakka AS
          </p>
          <p className="text-baby-text-light">
            Oslo, Norge
          </p>
        </div>
      </div>
    </div>
  );
}
