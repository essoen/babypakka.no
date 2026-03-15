import Link from 'next/link';
import { getPackages, getAgeCategories, getProducts } from '@/lib/api';
import { Package, AgeCategory, Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Sett sammen din pakke | Babypakka.no',
  description: 'Velg produkter tilpasset barnets alder. Sett sammen din egen babypakke med fast månedspris.',
  alternates: {
    canonical: 'https://babypakka.no/pakker',
  },
  openGraph: {
    title: 'Sett sammen din babypakke | Babypakka.no',
    description: 'Velg produkter tilpasset barnets alder. Fast månedspris, ingen bindingstid.',
    type: 'website',
    locale: 'nb_NO',
  },
};

interface AgeCategoryWithProducts {
  category: AgeCategory;
  products: Product[];
  monthlyPrice: number;
}

export default async function PakkerPage() {
  let categoriesWithProducts: AgeCategoryWithProducts[] = [];
  let error = false;

  try {
    const [ageCategories, allPackages] = await Promise.all([
      getAgeCategories(),
      getPackages(),
    ]);

    // For each age category, load its products and find the BASE package price
    categoriesWithProducts = await Promise.all(
      ageCategories.map(async (category) => {
        const products = await getProducts(category.id);
        const basePackage = allPackages.find(
          (p) => p.type.toUpperCase() === 'BASE' && p.ageCategory?.id === category.id
        );
        return {
          category,
          products,
          monthlyPrice: basePackage?.monthlyPrice ?? 0,
        };
      })
    );
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">Sett sammen din pakke</h1>
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

  const categoryColors = [
    { bg: 'bg-baby-blue-light/30', border: 'border-baby-blue-light', accent: 'bg-baby-blue' },
    { bg: 'bg-baby-pink-light/30', border: 'border-baby-pink-light', accent: 'bg-baby-pink' },
    { bg: 'bg-baby-sage-light/30', border: 'border-baby-sage-light', accent: 'bg-baby-sage' },
    { bg: 'bg-baby-warm/30', border: 'border-baby-warm-dark', accent: 'bg-baby-warm-dark' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-baby-text sm:text-4xl">
          Sett sammen din egen pakke
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-baby-text-light">
          Velg alderskategori og plukk de produktene du trenger. Fast månedspris per fase, uansett hvor mange produkter du velger.
        </p>
        <div className="mt-6">
          <Link
            href="/onboarding"
            className="inline-flex items-center rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
          >
            Kom i gang med ditt valg
          </Link>
        </div>
      </div>

      <div className="mt-16 space-y-16">
        {categoriesWithProducts.map(({ category, products, monthlyPrice }, index) => {
          const colors = categoryColors[index % categoryColors.length];
          return (
            <section key={category.id} id={`fase-${category.id}`}>
              <div className={`rounded-2xl ${colors.bg} border ${colors.border} p-6 sm:p-8`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className={`inline-block rounded-full ${colors.accent} px-3 py-1 text-xs font-medium text-white`}>
                      {category.minMonths}–{category.maxMonths} mnd
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-baby-text sm:text-3xl">
                      {category.label}
                    </h2>
                    <p className="mt-1 text-baby-text-light">
                      {products.length} produkter tilgjengelig
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-bold text-baby-blue">
                      {monthlyPrice} <span className="text-base font-normal text-baby-text-light">kr/mnd</span>
                    </p>
                    <p className="text-xs text-baby-text-light">Fast pris, velg fritt blant produktene</p>
                  </div>
                </div>

                {products.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-baby-text-light">Ingen produkter tilgjengelige for denne fasen ennå.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
