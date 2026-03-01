export default function PakkerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-10 w-64 rounded-lg bg-gray-200" />
        <div className="mt-2 h-5 w-96 rounded bg-gray-200" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-3 h-6 w-40 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-full rounded bg-gray-200" />
              <div className="mt-1 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-28 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
