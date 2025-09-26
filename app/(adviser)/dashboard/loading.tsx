export default function Loading() {
  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="p-8 space-y-12">
        {/* Statistics Overview */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 p-6 rounded-lg animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4 h-3 w-28 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="h-10 w-10 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200" />
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </div>

                  {/* Contact info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                      <div className="h-3 w-28 bg-gray-200 rounded" />
                    </div>
                  </div>

                  {/* Subject + Message */}
                  <div className="mb-4">
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-3 mt-4 w-full bg-gray-200 rounded mb-1" />
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-full bg-gray-200 rounded mb-1"
                      />
                    ))}
                    <div className="h-3 w-32 bg-gray-200 rounded mb-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
