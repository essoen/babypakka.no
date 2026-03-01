import type { Metadata } from 'next';
import Link from 'next/link';
import { getPackage } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const pkg = await getPackage(Number(id));
    return {
      title: `${pkg.name} | Babypakka.no`,
      description: pkg.description || `Detaljer om ${pkg.name}, babyutstyrspakke fra Babypakka.no`,
      openGraph: {
        title: `${pkg.name} | Babypakka.no`,
        description: pkg.description || `Detaljer om ${pkg.name}`,
        type: 'website',
        locale: 'nb_NO',
      },
    };
  } catch {
    return { title: 'Pakke | Babypakka.no' };
  }
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;
  let pkg;
  let error = false;

  try {
    pkg = await getPackage(Number(id));
  } catch {
    error = true;
  }

  if (error || !pkg) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/pakker"
          className="inline-flex items-center gap-1 text-sm text-baby-blue hover:text-baby-blue-dark transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Tilbake til pakker
        </Link>
        <div className="mt-8 rounded-2xl bg-baby-warm p-8 text-center">
          <p className="text-lg text-baby-text">
            Vi klarte dessverre ikke å hente denne pakken.
          </p>
          <p className="mt-2 text-sm text-baby-text-light">
            Vennligst prøv igjen senere, eller kontakt oss om problemet vedvarer.
          </p>
        </div>
      </div>
    );
  }

  const isBase = pkg.type === 'BASE';

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/pakker"
        className="inline-flex items-center gap-1 text-sm text-baby-blue hover:text-baby-blue-dark transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Tilbake til pakker
      </Link>

      {/* Package info */}
      <div className="mt-8">
        {/* Tag */}
        {isBase && pkg.ageCategory ? (
          <span className="inline-block rounded-full bg-baby-blue-light/50 px-4 py-1 text-sm font-medium text-baby-blue-dark">
            {pkg.ageCategory.label} ({pkg.ageCategory.minMonths}–{pkg.ageCategory.maxMonths} mnd)
          </span>
        ) : pkg.challengeTag ? (
          <span className="inline-block rounded-full bg-baby-sage-light/50 px-4 py-1 text-sm font-medium text-baby-sage">
            {pkg.challengeTag}
          </span>
        ) : null}

        <h1 className="mt-4 text-3xl font-bold text-baby-text sm:text-4xl">
          {pkg.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-baby-text-light">
          {pkg.description}
        </p>

        <p className="mt-6 text-3xl font-bold text-baby-blue">
          {pkg.monthlyPrice}{' '}
          <span className="text-lg font-normal text-baby-text-light">kr/mnd</span>
        </p>
      </div>

      {/* Products */}
      {pkg.products && pkg.products.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-baby-text">Innhold i pakken</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pkg.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-baby-text">Innhold i pakken</h2>
          <p className="mt-4 text-baby-text-light">
            Produktoversikten for denne pakken er ikke tilgjengelig ennå.
          </p>
        </section>
      )}
    </div>
  );
}
