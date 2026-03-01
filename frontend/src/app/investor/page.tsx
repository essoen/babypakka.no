import Link from 'next/link';

export const metadata = {
  title: 'Investorer | Babypakka.no',
  description: 'Babypakka er et konsept for abonnementsbasert babyutstyr. En idé fra Stein-Otto Svorstøl som søker investorer og medgründere.',
  openGraph: {
    title: 'Investorer | Babypakka.no',
    description: 'Babypakka er et konsept som søker investorer og samarbeidspartnere.',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default function InvestorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center">
        <span className="inline-block rounded-full bg-baby-pink-light px-4 py-1.5 text-sm font-medium text-baby-text">
          Konsept &middot; Ikke en aktiv tjeneste
        </span>
        <h1 className="mt-6 text-3xl font-bold text-baby-text sm:text-4xl">
          En idé jeg vil bygge videre på
        </h1>
        <p className="mt-4 text-lg text-baby-text-light max-w-2xl mx-auto">
          Babypakka er ikke en aktiv tjeneste i dag, men et gjennomarbeidet konsept
          for en abonnementstjeneste for babyutstyr. Jeg ser et stort potensial i ideen
          og søker investorer eller folk som vil være med å bygge den.
        </p>
      </section>

      {/* Om meg */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Hvem står bak?</h2>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Jeg heter <strong className="text-baby-text">Stein-Otto Svorstøl</strong> og har utviklet
          konseptet og denne prototypen for å vise hvordan en slik tjeneste kan fungere.
          Siden du ser nå, med pakkeoversikt, brukerflyt og administrasjonspanel, er
          en fungerende MVP bygget for å demonstrere ideen.
        </p>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Jeg ser etter én eller flere av disse:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-baby-blue text-xs font-bold text-white">1</span>
            <span className="text-baby-text-light">
              <strong className="text-baby-text">Investorer</strong> som vil finansiere veien fra konsept til lansering
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-baby-blue text-xs font-bold text-white">2</span>
            <span className="text-baby-text-light">
              <strong className="text-baby-text">Medgründere</strong> som brenner for bærekraft, baby eller abonnementsmodeller
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-baby-blue text-xs font-bold text-white">3</span>
            <span className="text-baby-text-light">
              <strong className="text-baby-text">Samarbeidspartnere</strong> innen logistikk, babyutstyr eller retail
            </span>
          </li>
        </ul>
      </section>

      {/* Konseptet */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-baby-text">Konseptet</h2>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Foreldre bruker titusenvis av kroner på babyutstyr som barnet vokser ut av
          på noen få måneder. Babypakka løser dette med en abonnementsmodell: foreldre
          leier kvalitetsutstyr tilpasset barnets alder, og bytter automatisk når barnet
          vokser inn i neste fase.
        </p>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Modellen kombinerer forutsigbar abonnementsinntekt med bærekraftig gjenbruk,
          noe som gir lav enhetskostnad over tid og sterk kundelojalitet.
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

      {/* Prototype */}
      <section className="mt-16 rounded-2xl bg-baby-warm p-8">
        <h2 className="text-2xl font-bold text-baby-text">Fungerende prototype</h2>
        <p className="mt-4 text-baby-text-light leading-relaxed">
          Det du ser på dette nettstedet er en fungerende teknisk prototype, ikke bare
          skisser. Registrering, pakkevisning, abonnementshåndtering og et komplett
          administrasjonspanel er bygget og klart til å demonstreres. Utforsk gjerne
          sidene for å se hvordan tjenesten er tenkt.
        </p>
      </section>

      {/* Pitch-dokument */}
      <section className="mt-16 rounded-2xl bg-baby-cream p-8 text-center">
        <h2 className="text-2xl font-bold text-baby-text">Investor-pitch</h2>
        <p className="mt-4 text-baby-text-light">
          Last ned presentasjonen for en grundigere gjennomgang av forretningsmodell,
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
        <h2 className="text-2xl font-bold text-baby-text">Interessert?</h2>
        <p className="mt-4 text-baby-text-light">
          Jeg vil gjerne høre fra deg, enten du er investor, potensiell medgründer
          eller bare nysgjerrig på konseptet.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:hei@babypakka.no"
            className="inline-flex items-center gap-2 rounded-full bg-baby-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-baby-blue-dark"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            hei@babypakka.no
          </a>
        </div>
      </section>
    </div>
  );
}
