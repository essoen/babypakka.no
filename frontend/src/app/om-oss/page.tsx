import Link from 'next/link';

export const metadata = {
  title: 'Om oss',
  description: 'Babypakka gjør kvalitets babyutstyr tilgjengelig gjennom abonnement. Bærekraftig, rimelig og enkelt for norske foreldre.',
  keywords: ['babypakka', 'om babypakka', 'babyutstyr abonnement', 'bærekraftig babyutstyr', 'leie babyutstyr norge'],
  openGraph: {
    title: 'Om Babypakka',
    description: 'Kvalitets babyutstyr tilgjengelig gjennom abonnement. Bærekraftig og rimelig.',
    type: 'website',
    locale: 'nb_NO',
  },
  alternates: {
    canonical: '/om-oss',
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

      {/* Konsept-disclaimer */}
      <section className="mt-24 text-center">
        <span className="inline-block rounded-full bg-baby-pink-light px-4 py-1.5 text-sm font-medium text-baby-text">
          Konsept &middot; Ikke en aktiv tjeneste
        </span>
      </section>

      {/* Hvem står bak */}
      <section className="mt-8">
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
        <div className="mt-6">
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
