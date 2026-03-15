import Link from 'next/link';

export const metadata = {
  title: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
  description: 'Abonnementstjeneste for babyutstyr. Velg produktene du trenger, tilpasset barnets alder. Fast månedspris.',
  alternates: {
    canonical: 'https://babypakka.no',
  },
  openGraph: {
    title: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
    description: 'Sett sammen din egen babypakke. Velg produktene du trenger, betal en fast månedspris.',
    type: 'website',
    locale: 'nb_NO',
    url: 'https://babypakka.no',
  },
};

const steps = [
  {
    number: '1',
    title: 'Registrer barnet ditt',
    description: 'Oppgi fødselsdato, så finner vi riktig alderskategori.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Velg dine produkter',
    description: 'Plukk akkurat de produktene du trenger fra vårt utvalg, tilpasset barnets alder.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Bytt når barnet vokser',
    description: 'Vi sender nytt utstyr når barnet går inn i neste fase.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

const agePhases = [
  {
    label: 'Nyfødt',
    range: '0–3 mnd',
    description: 'Babynest, stellematte, bæresele og alt du trenger de første månedene.',
    color: 'bg-baby-blue-light',
    textColor: 'text-baby-blue-dark',
    price: 399,
  },
  {
    label: 'Spedbarn',
    range: '3–6 mnd',
    description: 'Aktivitetsbue, lekematte, vognpose og mer for de nysgjerrige dagene.',
    color: 'bg-baby-pink-light',
    textColor: 'text-baby-pink',
    price: 349,
  },
  {
    label: 'Krabber',
    range: '6–12 mnd',
    description: 'Sikkerhetsgitter, krabbestativ og stimulerende utstyr for utforskeren.',
    color: 'bg-baby-sage-light',
    textColor: 'text-baby-sage',
    price: 449,
  },
  {
    label: 'Småbarn',
    range: '1–2 år',
    description: 'Sparkesykkel, høystol og robuste produkter for aktive småbarn.',
    color: 'bg-baby-warm',
    textColor: 'text-baby-warm-dark',
    price: 499,
  },
];

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Babypakka.no',
  url: 'https://babypakka.no',
  description: 'Abonnementstjeneste for babyutstyr. Sett sammen din egen pakke med produkter tilpasset barnets alder.',
  inLanguage: 'nb',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-baby-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight text-baby-text sm:text-5xl lg:text-6xl">
                Sett sammen din egen{' '}
                <span className="text-baby-blue">babypakke</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-baby-text-light">
                Velg akkurat de produktene du trenger, tilpasset barnets alder.
                Fast månedspris, ingen bindingstid. Bytt når barnet vokser.
              </p>
              <div className="mt-8">
                <Link
                  href="/pakker"
                  className="inline-flex items-center rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
                >
                  Se produkter
                </Link>
              </div>
            </div>
            {/* Illustration placeholder */}
            <div className="mt-12 flex-1 lg:mt-0">
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-baby-warm sm:h-80 sm:w-80">
                <svg
                  className="h-32 w-32 text-baby-blue/40 sm:h-40 sm:w-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={0.75}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hvordan det fungerer */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-baby-text sm:text-4xl">
            Hvordan det fungerer
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-baby-blue/10 text-baby-blue">
                  {step.icon}
                </div>
                <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-baby-blue text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-baby-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-baby-text-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aldersfaser */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-baby-text sm:text-4xl">
            Velg produkter for barnets fase
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-baby-text-light">
            Velg alderskategori og plukk de produktene som passer best for deg og barnet ditt. Fast månedspris per fase.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agePhases.map((phase) => (
              <Link
                key={phase.label}
                href="/pakker"
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`${phase.color} flex h-32 items-center justify-center`}>
                  <span className={`text-4xl font-bold ${phase.textColor} opacity-60`}>
                    {phase.range}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-baby-text group-hover:text-baby-blue transition-colors">
                    {phase.label}
                  </h3>
                  <p className="mt-1 text-sm text-baby-text-light">
                    {phase.description}
                  </p>
                  <p className="mt-3 text-xl font-bold text-baby-blue">
                    {phase.price} <span className="text-sm font-normal text-baby-text-light">kr/mnd</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-baby-text sm:text-4xl">
            Klar til å komme i gang?
          </h2>
          <p className="mt-4 text-lg text-baby-text-light">
            Registrer barnet ditt og velg produktene du trenger. Ingen bindingstid, og du kan endre valget når som helst.
          </p>
          <div className="mt-8">
            <Link
              href="/pakker"
              className="inline-flex items-center rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
            >
              Kom i gang
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
