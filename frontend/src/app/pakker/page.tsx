import { getPackages } from '@/lib/api';
import { Package } from '@/types';
import PackageCard from '@/components/PackageCard';

export const metadata = {
  title: 'Pakker | Babypakka.no',
  description: 'Se alle utstyrspakker for baby — fra nyfodt til smabarn. Basispakker og tilleggspakker.',
  openGraph: {
    title: 'Utstyrspakker | Babypakka.no',
    description: 'Se alle utstyrspakker for baby — fra nyfodt til smabarn.',
    type: 'website',
    locale: 'nb_NO',
  },
};

export default async function PakkerPage() {
  let basePackages: Package[] = [];
  let addonPackages: Package[] = [];
  let error = false;

  try {
    const allPackages = await getPackages();
    basePackages = allPackages.filter((p) => p.type.toUpperCase() === 'BASE');
    addonPackages = allPackages.filter((p) => p.type.toUpperCase() === 'ADDON');
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Pakker</h1>
        <div className="mt-8 rounded-2xl bg-baby-warm p-8 text-center">
          <p className="text-lg text-baby-text">
            Vi klarte dessverre ikke å hente pakkene akkurat nå.
          </p>
          <p className="mt-2 text-sm text-baby-text-light">
            Vennligst prøv igjen senere, eller kontakt oss om problemet vedvarer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Basispakker */}
      <section>
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Basispakker</h1>
        <p className="mt-2 text-baby-text-light">
          Velg basispakken som passer barnets alder. Pakken oppdateres automatisk etter hvert som barnet vokser.
        </p>
        {basePackages.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {basePackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-baby-text-light">Ingen basispakker tilgjengelige.</p>
        )}
      </section>

      {/* Tilleggspakker */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-baby-text sm:text-4xl">Tilleggspakker</h2>
        <p className="mt-2 text-baby-text-light">
          Legg til ekstra pakker for spesifikke behov — søvn, reise, amming og aktivitet.
        </p>
        {addonPackages.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {addonPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-baby-text-light">Ingen tilleggspakker tilgjengelige.</p>
        )}
      </section>
    </div>
  );
}
