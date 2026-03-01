export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-40 rounded-lg bg-gray-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-10 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
