import Link from 'next/link';
import { Package } from '@/types';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const isBase = pkg.type === 'BASE';

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Top color accent */}
      <div
        className={`h-2 ${isBase ? 'bg-baby-blue' : 'bg-baby-sage'}`}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Tag */}
        {isBase && pkg.ageCategory ? (
          <span className="mb-2 inline-block w-fit rounded-full bg-baby-blue-light/50 px-3 py-1 text-xs font-medium text-baby-blue-dark">
            {pkg.ageCategory.label}
          </span>
        ) : pkg.challengeTag ? (
          <span className="mb-2 inline-block w-fit rounded-full bg-baby-sage-light/50 px-3 py-1 text-xs font-medium text-baby-sage">
            {pkg.challengeTag}
          </span>
        ) : null}

        {/* Name */}
        <h3 className="text-lg font-semibold text-baby-text">{pkg.name}</h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm text-baby-text-light line-clamp-3">
          {pkg.description}
        </p>

        {/* Price */}
        <p className="mt-4 text-2xl font-bold text-baby-blue">
          fra {pkg.monthlyPrice} <span className="text-base font-normal text-baby-text-light">kr/mnd</span>
        </p>

        {/* Link */}
        <Link
          href={`/pakker/${pkg.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border-2 border-baby-blue px-5 py-2 text-sm font-medium text-baby-blue transition-colors hover:bg-baby-blue hover:text-white"
        >
          Se innhold
        </Link>
      </div>
    </article>
  );
}
