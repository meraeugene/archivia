export default function Loading() {
  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Advisory Requests</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 p-8">
        {Array.from({ length: 5 }).map((_, i) => (
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
                {Array.from({ length: 17 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-full bg-gray-200 rounded mb-1"
                  />
                ))}
                <div className="h-3 w-32 bg-gray-200 rounded mb-1" />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 mt-8">
                <div className="flex-1 h-9 bg-gray-200 rounded-md" />
                <div className="flex-1 h-9 bg-gray-200 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
