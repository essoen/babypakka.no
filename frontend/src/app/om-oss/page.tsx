import Link from 'next/link';

export const metadata = {
  title: 'Om oss | Babypakka.no',
  description: 'Lær mer om Babypakka. Vi gjør kvalitetsutstyr for baby tilgjengelig gjennom abonnement. Bærekraftig, rimelig og enkelt.',
  openGraph: {
    title: 'Om oss | Babypakka.no',
    description: 'Vi gjør kvalitetsutstyr for baby tilgjengelig gjennom abonnement.',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default function OmOssPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Om Babypakka</h1>
        <p className="mt-4 text-lg text-baby-text-light">
          Vi gjør kvalitetsutstyr for baby tilgjengelig for alle, gjennom et enkelt og fleksibelt abonnement.
        </p>
      </section>

      {/* Vår misjon */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Vår misjon</h2>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Babypakka ble startet med én enkel idé: foreldre trenger ikke å eie alt babyutstyr selv.
          Hos oss registrerer du barnets fødselsdato, og får tilgang til alderstilpassede utstyrspakker
          som du leier månedlig. Når barnet vokser, bytter vi utstyret slik at du alltid har det
          som passer.
        </p>
      </section>

      {/* Hvorfor leie */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Hvorfor leie babyutstyr?</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-baby-sage-light p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-sage">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-baby-text">Bærekraft</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Gjenbruk fremfor kjøp og kast. Utstyret får flere liv, og du bidrar til mindre avfall.
            </p>
          </div>

          <div className="rounded-2xl bg-baby-pink-light p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-pink">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-baby-text">Økonomi</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Spar penger sammenlignet med å kjøpe alt nytt. Betal kun for det du trenger, når du trenger det.
            </p>
          </div>

          <div className="rounded-2xl bg-baby-blue-light p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-baby-blue">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H6.75m11.25 0h2.625c.621 0 1.125-.504 1.125-1.125v-4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v4.875c0 .621.504 1.125 1.125 1.125" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-baby-text">Bekvemmelighet</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Vi håndterer logistikken. Du får utstyret levert hjem, og vi henter det når du er ferdig.
            </p>
          </div>
        </div>
      </section>

      {/* Slik fungerer det */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Slik fungerer det</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-baby-warm text-lg font-bold text-baby-text">
              1
            </div>
            <h3 className="mt-4 font-semibold text-baby-text">Registrer barnet</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Opprett en konto og legg inn barnets fødselsdato.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-baby-warm text-lg font-bold text-baby-text">
              2
            </div>
            <h3 className="mt-4 font-semibold text-baby-text">Velg pakke</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Velg en basispakke som passer barnets alder, og eventuelle tilleggspakker.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-baby-warm text-lg font-bold text-baby-text">
              3
            </div>
            <h3 className="mt-4 font-semibold text-baby-text">Bytt når barnet vokser</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Når barnet vokser inn i en ny fase, bytter du enkelt til neste pakke.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <Link
          href="/pakker"
          className="rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
        >
          Se våre pakker
        </Link>
      </section>
    </div>
  );
}
