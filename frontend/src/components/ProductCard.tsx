import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const conditionLabel = product.condition === 'NEW' ? 'Ny' : 'Brukt';
  const conditionColor =
    product.condition === 'NEW'
      ? 'bg-baby-sage text-white'
      : 'bg-baby-warm-dark text-baby-text';

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-baby-warm">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-16 w-16 text-baby-warm-dark"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}

        {/* Condition badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${conditionColor}`}
        >
          {conditionLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-baby-text group-hover:text-baby-blue transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-baby-text-light line-clamp-2">
          {product.description}
        </p>
      </div>
    </article>
  );
}
