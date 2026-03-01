export default function PakkeDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="mt-4 h-10 w-72 rounded-lg bg-gray-200" />
        <div className="mt-2 h-5 w-96 rounded bg-gray-200" />
        <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
        <div className="mt-8 h-6 w-40 rounded bg-gray-200" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="h-32 w-full rounded-lg bg-gray-200" />
              <div className="mt-3 h-5 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-4 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
