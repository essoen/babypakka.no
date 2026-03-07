import { getProducts, getAgeCategories } from '@/lib/api';
import { Product, AgeCategory } from '@/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const metadata = {
  title: 'Produkter | Babypakka.no',
  description: 'Utforsk alle babyproduktene våre. Babynest, bæresele, høystol, sparkesykkel og mer.',
  alternates: {
    canonical: 'https://babypakka.no/produkter',
  },
  openGraph: {
    title: 'Produktkatalog | Babypakka.no',
    description: 'Utforsk alle babyproduktene våre.',
    type: 'website',
    locale: 'nb_NO',
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProdukterPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const ageCategoryParam = resolvedSearchParams.ageCategory;
  const selectedAgeCategoryId = ageCategoryParam ? Number(ageCategoryParam) : undefined;

  let products: Product[] = [];
  let ageCategories: AgeCategory[] = [];
  let error = false;

  try {
    const [productsData, ageCategoriesData] = await Promise.all([
      getProducts(selectedAgeCategoryId),
      getAgeCategories(),
    ]);
    products = productsData;
    ageCategories = ageCategoriesData;
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Produkter</h1>
        <div className="mt-8 rounded-2xl bg-baby-warm p-8 text-center">
          <p className="text-lg text-baby-text">
            Vi klarte dessverre ikke å hente produktene akkurat nå.
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
      <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Produkter</h1>
      <p className="mt-2 text-baby-text-light">
        Utforsk vårt utvalg av kvalitetsutstyr for babyer og småbarn.
      </p>

      {/* Age category filter */}
      {ageCategories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/produkter"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !selectedAgeCategoryId
                ? 'bg-baby-blue text-white'
                : 'bg-white text-baby-text hover:bg-baby-warm'
            }`}
          >
            Alle
          </Link>
          {ageCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produkter?ageCategory=${cat.id}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedAgeCategoryId === cat.id
                  ? 'bg-baby-blue text-white'
                  : 'bg-white text-baby-text hover:bg-baby-warm'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-baby-text-light">
          Ingen produkter funnet{selectedAgeCategoryId ? ' for denne alderskategorien' : ''}.
        </p>
      )}
    </div>
  );
}
