/* eslint-disable @next/next/no-img-element */
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
import SearchLoading from "@/components/SearchLoading";
import GridOverlay from "@/components/GridOverlay";

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
    isSearching,
    isSorting,
    isCategorizing,
    setSearchQuery,
    handleSearch,
    handlePreview,
    handleDownload,
    closeModal,
    currentCategory,
    loadMore,
    hasMore,
    loadingMore,
    handleSortChange,
    sort,
    thesisCount,
    handleCategoryChange,
  } = useArchivia(initialTheses);

  return (
    <main className="min-h-screen bg-gray-50 text-black relative ">
      <Hero />

      <GridOverlay />

      <SearchCategory
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <section className="md:py-15 md:pt-8 py-8 px-4 md:px-6 ">
        <div className="max-w-6xl mx-auto ">
          {!isSearching && !isSorting && !isCategorizing && (
            <div className="mb-6 md:mb-10 flex flex-col  gap-4">
              <div className="flex w-full justify-between flex-col-reverse items-center md:flex-row gap-4">
                <div className="mb-3 sm:mb-0 text-gray-700">
                  {thesisCount === null ? (
                    <div className="h-4 w-50 bg-gray-200 rounded animate-pulse"></div>
                  ) : currentCategory === "all" ? (
                    `Showing ${displayedTheses.length} of ${thesisCount} total theses`
                  ) : (
                    <div className="text-center">
                      Showing {displayedTheses.length} of {thesisCount} total
                      theses in{" "}
                      <span className="font-semibold text-black">
                        {currentCategory}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 flex-col md:flex-row  w-full md:w-fit  ">
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full py-5 md:w-[150px] border-none shadow-sm text-sm hover:shadow-md transition-all rounded-sm bg-white z-5 cursor-pointer ">
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
                    onValueChange={(val) => handleCategoryChange(val)}
                  >
                    <SelectTrigger className="w-full py-5   min-w-[150px] bg-white z-5   border-none shadow-sm text-sm rounded-sm hover:shadow-md transition-all cursor-pointer">
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
          )}

          {isSearching && <SearchLoading />}

          {!isSearching &&
            !isSorting &&
            !isCategorizing &&
            displayedTheses.length > 0 && (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-8"
                columnClassName="space-y-8"
              >
                {displayedTheses.map((thesis, index) => (
                  <div
                    key={`${currentCategory}-${sort}-${searchQuery}-${thesis.id}-${index}`}
                    className="fade-slide-up"
                  >
                    <ThesisCard
                      thesis={thesis}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      isInitiallyBookmarked={
                        thesis.id !== undefined &&
                        userBookmarks?.includes(thesis.id)
                      }
                      searchQuery={searchQuery}
                    />
                  </div>
                ))}
              </Masonry>
            )}

          {!isSearching &&
            !isSorting &&
            !isCategorizing &&
            displayedTheses.length === 0 && (
              <div className="text-center py-20 text-gray-500 w-full col-span-2 ">
                <p className="text-lg">No theses found matching your search.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}

          {loadingMore && (
            <div className="flex justify-center items-center py-10 w-full col-span-2">
              <img
                src="/images/logo.png"
                alt="Archivia Logo"
                className="h-12 w-12 animate-fade"
              />
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

          {!isSearching &&
            !isSorting &&
            !isCategorizing &&
            !hasMore &&
            !loadingMore &&
            displayedTheses.length > 0 && (
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
        searchQuery={searchQuery}
      />
    </main>
  );
};

export default ArchiviaClient;
