import Link from 'next/link';

export const metadata = {
  title: 'Investorer | Babypakka.no',
  description: 'Informasjon for investorer — Babypakka er en abonnementstjeneste for babyutstyr med stort vekstpotensial i det nordiske markedet.',
  openGraph: {
    title: 'Investorer | Babypakka.no',
    description: 'Informasjon for investorer i Babypakka.',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default function InvestorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Investorer</h1>
        <p className="mt-4 text-lg text-baby-text-light">
          Babypakka bygger fremtidens tjeneste for babyutstyr i Norden.
        </p>
      </section>

      {/* Om selskapet */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Om Babypakka</h2>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Babypakka er en abonnementstjeneste der foreldre leier kvalitetsutstyr tilpasset
          barnets alder. Istedenfor å kjøpe dyrt utstyr som brukes i noen få måneder, får
          familier tilgang til det de trenger — og bytter automatisk når barnet vokser.
        </p>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Modellen kombinerer forutsigbar abonnementsinntekt med bærekraftig gjenbruk av
          produkter, noe som gir lav enhetskostnad over tid og sterk kundelojalitet.
        </p>
      </section>

      {/* Muligheten */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Muligheten</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-baby-blue-light p-6">
            <h3 className="text-lg font-semibold text-baby-text">Stort marked</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Over 50 000 fødsler i Norge hvert år. Foreldre bruker i snitt 30 000–50 000 kr
              på babyutstyr det første året.
            </p>
          </div>

          <div className="rounded-2xl bg-baby-pink-light p-6">
            <h3 className="text-lg font-semibold text-baby-text">Forutsigbar inntekt</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Abonnementsmodell med månedlig betaling gir stabil og forutsigbar
              inntektsstrøm med lav churn.
            </p>
          </div>

          <div className="rounded-2xl bg-baby-sage-light p-6">
            <h3 className="text-lg font-semibold text-baby-text">Bærekraft</h3>
            <p className="mt-2 text-sm text-baby-text-light">
              Sirkulærøkonomi i praksis. Hvert produkt brukes av flere familier, noe som
              reduserer avfall og kostnader.
            </p>
          </div>
        </div>
      </section>

      {/* Pitch-dokument */}
      <section className="mt-16 rounded-2xl bg-baby-cream p-8 text-center">
        <h2 className="text-2xl font-bold text-baby-text">Investor-pitch</h2>
        <p className="mt-4 text-baby-text-light">
          Last ned vår presentasjon for en grundigere gjennomgang av forretningsmodell,
          markedsmuligheter og vekstplan.
        </p>
        <div className="mt-6">
          <a
            href="/babypakka_investor_pitch.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Last ned presentasjon (PDF)
          </a>
        </div>
      </section>

      {/* Kontakt */}
      <section className="mt-16 text-center">
        <p className="text-baby-text-light">
          Interessert i å vite mer? Ta kontakt med oss.
        </p>
        <div className="mt-4">
          <Link
            href="/kontakt"
            className="rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
          >
            Kontakt oss
          </Link>
        </div>
      </section>
    </div>
  );
}
