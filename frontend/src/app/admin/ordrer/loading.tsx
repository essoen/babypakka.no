export default function AdminOrdrerLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-32 rounded-lg bg-gray-200" />
      <div className="mt-2 h-5 w-64 rounded bg-gray-200" />
      <div className="mt-6 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-200" />
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-white shadow-sm">
        <div className="space-y-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-4 py-4">
              <div className="h-4 w-8 rounded bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
