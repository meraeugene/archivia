"use client";

import { Thesis } from "@/types/thesis";
import Hero from "@/sections/Hero";
import ThesisCard from "@/components/ThesisCard";
import ThesisModal from "@/components/ThesisModal";
import AdviserRecommender from "@/sections/AdviserRecommender";
import { useArchivia } from "@/hooks/useArchivia";
import SearchCategory from "@/components/SearchFilter";
import { JwtPayload } from "jsonwebtoken";
import { StudentAdviser } from "@/types/studentAdviser";
import Masonry from "react-masonry-css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ArchiviaClientProps {
  initialTheses: Thesis[];
  session: JwtPayload | null;
  categoryOptions: { key: string; label: string }[];
  userBookmarks?: number[];
  studentAdviser?: StudentAdviser | null;
}

const breakpointColumnsObj = {
  default: 2,
  768: 1,
};

const ArchiviaClient: React.FC<ArchiviaClientProps> = ({
  initialTheses,
  session,
  categoryOptions,
  userBookmarks = [],
  studentAdviser,
}) => {
  const {
    displayedTheses,
    isModalOpen,
    selectedThesis,
    searchQuery,
    isPending,
    setSearchQuery,
    handleSearch,
    handlePreview,
    handleDownload,
    closeModal,
    currentCategory,
    setCurrentCategory,
    loadMore,
    hasMore,
    loadingMore,
    handleSortChange,
    sort,
    thesisCount,
  } = useArchivia(initialTheses);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Hero />

      <SearchCategory
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        categoryOptions={categoryOptions}
        onSearch={handleSearch}
      />

      <section className="md:py-15 md:pt-8 py-8">
        <div className="max-w-6xl mx-auto ">
          <div className="mb-6 md:mb-10 flex flex-col gap-4">
            <div className="flex w-full justify-between flex-col-reverse items-center md:flex-row gap-4">
              <div className="mb-3 sm:mb-0 text-gray-700">
                {isPending ? (
                  "Searching..."
                ) : currentCategory === "all" ? (
                  `Showing ${displayedTheses.length} of ${thesisCount} total theses`
                ) : (
                  <>
                    Showing {displayedTheses.length} of {thesisCount} total
                    theses in{" "}
                    <span className="font-semibold text-black">
                      {currentCategory}
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[150px] border-gray-200 shadow-sm text-sm hover:shadow-md transition-all cursor-pointer">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Newest</SelectItem>
                    <SelectItem value="title">Title (A–Z)</SelectItem>
                    <SelectItem value="adviser">Adviser (A–Z)</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={currentCategory}
                  onValueChange={(val) => setCurrentCategory(val)}
                >
                  <SelectTrigger className="w-auto min-w-[150px] border-gray-200 shadow-sm text-sm hover:shadow-md transition-all cursor-pointer">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-8"
            columnClassName="space-y-8"
          >
            {displayedTheses.map((thesis) => (
              <div key={thesis.id} className="fade-slide-up">
                <ThesisCard
                  thesis={thesis}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  isInitiallyBookmarked={
                    thesis.id !== undefined &&
                    userBookmarks?.includes(thesis.id)
                  }
                />
              </div>
            ))}
          </Masonry>

          {!isPending && displayedTheses.length === 0 && (
            <div className="text-center py-20 text-gray-500 w-full col-span-2 break-inside-avoid">
              <p className="text-lg">No theses found matching your search.</p>
              <p className="text-sm mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {(isPending || loadingMore) && (
            <div className="flex justify-center items-center py-10 w-full col-span-2">
              <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          )}

          {/* Infinite Scroll + End Message */}
          <div
            ref={(el) => {
              if (!el) return;
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                  }
                },
                {
                  rootMargin: "200px", // Trigger earlier for smoother load
                  threshold: 0.5, // Fire when half visible, more precise
                }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }}
            className="h-10"
          ></div>

          {!hasMore && !loadingMore && displayedTheses.length > 0 && (
            <div className="text-center py-5 text-gray-500">
              {currentCategory === "all" ? (
                <>
                  You’ve reached the end — all {displayedTheses.length} theses
                  loaded.
                </>
              ) : (
                <>
                  You’ve reached the end of the{" "}
                  <span className="font-semibold text-gray-700">
                    {currentCategory}
                  </span>{" "}
                  category — all {displayedTheses.length} theses loaded.
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Only show if login, student role and no adviser */}
      {session && session.role === "student" && !studentAdviser && (
        <AdviserRecommender />
      )}

      <ThesisModal
        thesis={selectedThesis}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={handleDownload}
      />
    </main>
  );
};

export default ArchiviaClient;
