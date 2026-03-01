import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-baby-warm bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-lg font-bold text-baby-blue">
              Baby<span className="text-baby-pink">pakka</span>
            </span>
            <p className="text-xs text-baby-text-light">
              &copy; {new Date().getFullYear()} Babypakka. Alle rettigheter reservert.
            </p>
          </div>

          <nav className="flex gap-6">
            <Link
              href="/om-oss"
              className="text-sm text-baby-text-light hover:text-baby-blue transition-colors"
            >
              Om oss
            </Link>
            <Link
              href="/investor"
              className="text-sm text-baby-text-light hover:text-baby-blue transition-colors"
            >
              Investor
            </Link>
            <Link
              href="/kontakt"
              className="text-sm text-baby-text-light hover:text-baby-blue transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="/personvern"
              className="text-sm text-baby-text-light hover:text-baby-blue transition-colors"
            >
              Personvern
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
