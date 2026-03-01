'use client';

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl bg-baby-warm p-8 text-center">
      <h2 className="text-xl font-bold text-baby-text">Noe gikk galt i admin</h2>
      <p className="mt-2 text-baby-text-light">
        Kunne ikke laste inn admin-siden. Vennligst prov igjen.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-baby-blue-dark"
      >
        Prov igjen
      </button>
    </div>
  );
}
