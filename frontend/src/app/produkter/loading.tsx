export default function ProdukterLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-10 w-56 rounded-lg bg-gray-200" />
        <div className="mt-2 h-5 w-80 rounded bg-gray-200" />
        <div className="mt-6 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="h-40 w-full rounded-xl bg-gray-200" />
              <div className="mt-3 h-5 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-4 w-full rounded bg-gray-200" />
              <div className="mt-1 h-4 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
