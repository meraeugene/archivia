"use client";

import { BookOpen } from "lucide-react";

interface TopBookmarksCardProps {
  bookmarks: Array<{
    title: string;
    bookmark_count: number;
  }>;
}

export default function TopBookmarksCard({ bookmarks }: TopBookmarksCardProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b px-4 py-5 flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-gray-700" />
        <h3 className="leading-none font-semibold">Top Bookmarked Theses</h3>
      </div>

      {/* Content */}
      <div>
        <div className="space-y-0 ">
          {bookmarks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No bookmarks yet.</p>
            </div>
          )}

          {bookmarks.map((b, i) => (
            <div
              key={i}
              className={`group relative bg-white p-4  ${
                i < bookmarks.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="relative flex justify-between items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="text-sm  font-semibold bg-black text-white px-2 py-1 ">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-medium text-black leading-snug break-words max-w-5xl">
                    {b.title}
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-2xl font-bold text-black">
                    {b.bookmark_count}
                  </span>
                  <span className="text-xs text-gray-600 uppercase tracking-wider">
                    bookmarks
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
