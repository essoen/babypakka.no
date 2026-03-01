export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-48 rounded-lg bg-gray-200" />
            <div className="mt-2 h-5 w-72 rounded bg-gray-200" />
          </div>
          <div className="h-10 w-36 rounded-full bg-gray-200" />
        </div>
        <div className="mt-6 h-24 rounded-2xl bg-gray-200" />
        <div className="mt-8 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <div className="h-6 w-32 rounded bg-gray-200" />
                  <div className="mt-1 h-4 w-48 rounded bg-gray-200" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-16 rounded-xl bg-gray-100" />
                <div className="h-16 rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
