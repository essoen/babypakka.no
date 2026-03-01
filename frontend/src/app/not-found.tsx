import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-baby-blue">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-baby-text">Siden ble ikke funnet</h2>
      <p className="mt-4 text-baby-text-light">
        Beklager, vi finner ikke siden du leter etter.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
      >
        Til forsiden
      </Link>
    </div>
  );
}
