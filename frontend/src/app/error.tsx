'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-baby-text">Noe gikk galt</h1>
      <p className="mt-4 text-baby-text-light">
        Beklager, det oppstod en uventet feil. Vennligst prov igjen.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
      >
        Prov igjen
      </button>
    </div>
  );
}
