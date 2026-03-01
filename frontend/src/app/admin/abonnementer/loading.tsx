export default function AdminAbonnementerLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-44 rounded-lg bg-gray-200" />
      <div className="mt-6 rounded-2xl bg-white shadow-sm">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-50 px-4 py-4">
            <div>
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-4 w-48 rounded bg-gray-200" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-full bg-gray-200" />
              <div className="h-5 w-20 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
