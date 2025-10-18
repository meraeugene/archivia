"use client";

import { useArchivia } from "@/hooks/useArchivia";
import { Thesis } from "@/types/thesis";
import ThesisCard from "@/components/ThesisCard";
import ThesisCardSkeleton from "@/components/ThesisCardSkeleton";
import ThesisModal from "@/components/ThesisModal";
import SearchCategory from "@/components/SearchFilter";
import { categoryOptions } from "@/data/options";

const BrowseClient = ({ initialTheses }: { initialTheses: Thesis[] }) => {
  const {
    displayedTheses,
    isModalOpen,
    selectedThesis,
    searchQuery,
    currentCategory,
    isPending,
    setSearchQuery,
    setCurrentCategory,
    handleSearch,
    handlePreview,
    handleDownload,
    closeModal,
    loadMore,
    hasMore,
    loadingMore,
    handleSortChange,
    sort,
  } = useArchivia(initialTheses);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="py-20 text-center ">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-5xl text-black font-extrabold mb-5 tracking-tight">
            Browse Archive Thesis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto ">
            Browse and access University of Science and Technology of Southern
            Philippines academic theses with smart search and filtering designed
            for students, researchers, and educators.
          </p>
        </div>
      </section>

      <SearchCategory
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        categoryOptions={categoryOptions}
        onSearch={handleSearch}
      />

      <section className="py-15">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex w-full justify-between sm:items-center gap-4">
              <div className="mb-3 sm:mb-0 text-gray-700">
                {isPending
                  ? "Searching..."
                  : `Showing ${displayedTheses.length} theses`}
              </div>

              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:border-black transition-all cursor-pointer"
              >
                <option value="recent">Newest</option>
                <option value="title">Title (A–Z)</option>
                <option value="adviser">Adviser (A–Z)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedTheses.map((thesis) => (
              <ThesisCard
                key={thesis.id}
                thesis={thesis}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            ))}

            {(isPending || loadingMore) &&
              Array.from({ length: 6 }).map((_, i) => (
                <ThesisCardSkeleton key={i} />
              ))}

            {!isPending && displayedTheses.length === 0 && (
              <div className="text-center py-20 text-gray-500 col-span-2">
                <p className="text-lg">No theses found matching your search.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div
              ref={(el) => {
                if (!el) return;
                const observer = new IntersectionObserver(
                  (entries) => {
                    if (entries[0].isIntersecting) {
                      loadMore();
                    }
                  },
                  { rootMargin: "300px" } // triggers before bottom
                );
                observer.observe(el);
                return () => observer.disconnect();
              }}
              className="h-10"
            />
          )}
        </div>
      </section>

      <ThesisModal
        thesis={selectedThesis}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={handleDownload}
      />
    </main>
  );
};

export default BrowseClient;
