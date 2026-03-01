export const metadata = {
  title: 'Personvernerklæring | Babypakka.no',
  description: 'Les Babypakkas personvernerklæring. Hvordan vi samler inn, bruker og beskytter dine personopplysninger.',
  openGraph: {
    title: 'Personvernerklæring | Babypakka.no',
    description: 'Hvordan Babypakka behandler dine personopplysninger.',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default function PersonvernPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Personvernerklæring</h1>
      <p className="mt-4 text-baby-text-light">
        Sist oppdatert: Mars 2026
      </p>

      <div className="mt-12 space-y-10">
        {/* 1. Behandlingsansvarlig */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">1. Behandlingsansvarlig</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Babypakka AS er behandlingsansvarlig for personopplysningene som samles inn gjennom
            nettstedet babypakka.no. Har du spørsmål om vår behandling av personopplysninger,
            kan du kontakte oss på{' '}
            <a href="mailto:hei@babypakka.no" className="text-baby-blue hover:text-baby-blue-dark transition-colors">
              hei@babypakka.no
            </a>.
          </p>
        </section>

        {/* 2. Hvilke personopplysninger vi samler inn */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">2. Hvilke personopplysninger vi samler inn</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Vi samler inn følgende personopplysninger når du bruker tjenesten vår:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-baby-text-light">
            <li>Navn og e-postadresse</li>
            <li>Leveringsadresse</li>
            <li>Barnets fødselsdato og navn</li>
            <li>Informasjon om abonnement og bestillinger</li>
          </ul>
        </section>

        {/* 3. Formål med behandlingen */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">3. Formål med behandlingen</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Vi bruker personopplysningene dine til følgende formål:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-baby-text-light">
            <li>Levere abonnementstjenesten og administrere kontoen din</li>
            <li>Sende alderstilpassede utstyrspakker til riktig adresse</li>
            <li>Kommunisere med deg om abonnementet, leveranser og kundeservice</li>
            <li>Forbedre tjenesten vår basert på anonymisert bruksdata</li>
          </ul>
        </section>

        {/* 4. Rettslig grunnlag */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">4. Rettslig grunnlag</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Behandlingen av personopplysninger skjer på følgende rettslige grunnlag:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-baby-text-light">
            <li>
              <strong>Avtale</strong> (GDPR art. 6 nr. 1 bokstav b): Behandlingen er nødvendig for å
              oppfylle abonnementsavtalen og levere tjenesten.
            </li>
            <li>
              <strong>Samtykke</strong> (GDPR art. 6 nr. 1 bokstav a): For utsending av markedsføring
              og nyhetsbrev innhenter vi ditt samtykke.
            </li>
            <li>
              <strong>Rettslig forpliktelse</strong> (GDPR art. 6 nr. 1 bokstav c): For å oppfylle
              regnskaps- og bokføringskrav.
            </li>
          </ul>
        </section>

        {/* 5. Deling med tredjeparter */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">5. Deling med tredjeparter</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Vi deler personopplysninger med følgende tredjeparter, kun i den grad det er nødvendig
            for å levere tjenesten:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-baby-text-light">
            <li>Transportselskaper for levering og henting av utstyrspakker</li>
            <li>Betalingsleverandører for sikker betalingsbehandling</li>
          </ul>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Vi selger aldri dine personopplysninger til tredjeparter.
          </p>
        </section>

        {/* 6. Lagring og sletting */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">6. Lagring og sletting</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Personopplysningene dine lagres så lenge du har et aktivt abonnement hos oss.
            Etter avsluttet abonnement oppbevarer vi opplysningene i henhold til lovpålagt
            oppbevaringstid (for eksempel regnskapsloven). Deretter slettes opplysningene.
          </p>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Du kan når som helst be om sletting av din konto og tilhørende data, med unntak
            av opplysninger vi er lovpålagt å beholde.
          </p>
        </section>

        {/* 7. Dine rettigheter */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">7. Dine rettigheter</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            I henhold til personvernforordningen (GDPR) har du følgende rettigheter:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-baby-text-light">
            <li><strong>Innsyn:</strong> Du har rett til å få vite hvilke personopplysninger vi har om deg.</li>
            <li><strong>Retting:</strong> Du kan be om at uriktige opplysninger blir korrigert.</li>
            <li><strong>Sletting:</strong> Du kan be om at opplysningene dine slettes.</li>
            <li><strong>Dataportabilitet:</strong> Du har rett til å motta opplysningene dine i et maskinlesbart format.</li>
            <li><strong>Begrensning:</strong> Du kan be om at behandlingen begrenses i visse tilfeller.</li>
            <li><strong>Innsigelse:</strong> Du kan motsette deg behandling basert på berettiget interesse.</li>
          </ul>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Dersom du mener at vi ikke behandler personopplysningene dine i samsvar med regelverket,
            har du rett til å klage til{' '}
            <a
              href="https://www.datatilsynet.no"
              target="_blank"
              rel="noopener noreferrer"
              className="text-baby-blue hover:text-baby-blue-dark transition-colors"
            >
              Datatilsynet
            </a>.
          </p>
        </section>

        {/* 8. Informasjonskapsler */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">8. Informasjonskapsler (cookies)</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Nettstedet bruker nødvendige informasjonskapsler for å håndtere innlogging og sikre at
            tjenesten fungerer korrekt. Vi bruker ikke sporingskapsler eller tredjepartskapsler
            for markedsføring.
          </p>
        </section>

        {/* 9. Endringer */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">9. Endringer i personvernerklæringen</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Vi kan oppdatere denne personvernerklæringen ved behov. Ved vesentlige endringer vil
            vi informere deg via e-post eller gjennom tjenesten. Den nyeste versjonen vil alltid
            være tilgjengelig på denne siden.
          </p>
        </section>

        {/* 10. Kontakt */}
        <section>
          <h2 className="text-xl font-bold text-baby-text">10. Kontakt oss</h2>
          <p className="mt-3 text-baby-text-light leading-relaxed">
            Har du spørsmål om personvern eller ønsker å utøve dine rettigheter, ta kontakt med oss:
          </p>
          <div className="mt-3 rounded-2xl bg-baby-warm p-6">
            <p className="font-semibold text-baby-text">Babypakka AS</p>
            <p className="mt-1 text-baby-text-light">Oslo, Norge</p>
            <a
              href="mailto:hei@babypakka.no"
              className="mt-1 inline-block text-baby-blue hover:text-baby-blue-dark transition-colors"
            >
              hei@babypakka.no
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
