"use client";

import { Bookmark, Download, Eye } from "lucide-react";
import { useState, useTransition } from "react";
import { useArchivia } from "@/hooks/useArchivia";
import { Thesis } from "@/types/thesis";
import ThesisModal from "@/components/ThesisModal";
import { toggleBookmark } from "@/actions/common/toggleBookmark";

interface BookmarksClientProps {
  bookmarks: Thesis[];
}

export default function BookmarksClient({
  bookmarks: initialBookmarks,
}: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [, startTransition] = useTransition();
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const {
    handlePreview: onPreview,
    handleDownload: onDownload,
    closeModal,
    isModalOpen,
    selectedThesis,
  } = useArchivia();

  const handleUnbookmark = (thesisId: number) => {
    // Optimistic removal
    setBookmarks((prev) => prev.filter((b) => b.id !== thesisId));

    // Mark this ID as pending
    setPendingIds((prev) => new Set(prev).add(thesisId));

    startTransition(async () => {
      try {
        await toggleBookmark(thesisId);
      } catch (err) {
        console.error(err);
      } finally {
        // Remove from pending after action
        setPendingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(thesisId);
          return newSet;
        });
      }
    });
  };

  if (bookmarks.length === 0) {
    return (
      <div className="relative overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:py-20 py-12 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-5 tracking-tight">
            No Bookmarks Yet
          </h1>
          <div className="w-48 h-1 bg-white mx-auto md:mb-8 mb-5"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Browse the{" "}
            <a href="/browse" className="text-blue-300 hover:underline">
              Thesis Archive
            </a>{" "}
            and bookmark your favorite works.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto bg-gray-50">
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:py-20 py-12 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-5 tracking-tight">
            My Bookmarks
          </h1>
          <div className="w-48 h-1 bg-white mx-auto md:mb-8 mb-4"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            View all your bookmarked theses here.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-14 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {bookmarks.map((thesis) => (
          <div
            key={thesis.id}
            className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 h-full "
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg font-extrabold leading-tight ">
                {thesis.title}
              </h3>
              <button
                disabled={thesis.id ? pendingIds.has(thesis.id) : false}
                onClick={() => thesis.id && handleUnbookmark(thesis.id)}
                className="cursor-pointer"
              >
                <Bookmark className="fill-black text-black" size={20} />
              </button>
            </div>

            <div className="space-y-1 mb-4  text-gray-600">
              <div>
                <strong>Adviser:</strong> {thesis.adviser_name || "N/A"}
              </div>

              <div className="flex  gap-2">
                <strong>Panel:</strong>
                <div className="flex flex-wrap gap-2">
                  {[
                    thesis.panel_member1 && `${thesis.panel_member1} (Chair)`,
                    thesis.panel_member2,
                    thesis.panel_member3,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </div>
              </div>

              <div>
                <strong>Proponents:</strong>{" "}
                {Array.isArray(thesis.proponents) &&
                thesis.proponents.length > 0
                  ? thesis.proponents.join(", ")
                  : "N/A"}
              </div>

              <div>
                <strong>Year:</strong> {thesis.defense_year || "N/A"}
              </div>

              {/* <div>
        <strong>Keywords:</strong>{" "}
        {Array.isArray(thesis.keywords) ? thesis.keywords.join(", ") : "N/A"}
      </div> */}

              <div className="flex gap-2 mt-3">
                <div className="flex flex-wrap gap-2">
                  {(thesis.category?.slice(0, 2) ?? ["Uncategorized"]).map(
                    (cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-white shadow-sm text-sm font-medium rounded-full"
                      >
                        {cat.trim()}
                      </span>
                    )
                  )}

                  {thesis.category && thesis.category.length > 2 && (
                    <span
                      onClick={() => onPreview(thesis)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full cursor-pointer hover:bg-gray-300 transition"
                    >
                      +{thesis.category.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className=" text-gray-700 mb-5 leading-relaxed line-clamp-4 mt-5">
              {thesis.abstract}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onPreview(thesis)}
                className="flex-1 bg-gray-50 border cursor-pointer border-gray-200 text-black px-4 py-2.5 rounded font-medium  transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Eye size={16} /> Preview
              </button>
              <button
                onClick={() => onDownload(thesis)}
                className="flex-1 text-white bg-black hover:bg-black/90 cursor-pointer px-4 py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <ThesisModal
        thesis={selectedThesis}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={onDownload}
      />
    </main>
  );
}
