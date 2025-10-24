"use client";

import { Thesis } from "@/types/thesis";
import Hero from "@/sections/Hero";
import ThesisCard from "@/components/ThesisCard";
import ThesisModal from "@/components/ThesisModal";
import AdviserRecommender from "@/sections/AdviserRecommender";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ThesisCardSkeleton from "@/components/ThesisCardSkeleton";
import { useArchivia } from "@/hooks/useArchivia";
import SearchCategory from "@/components/SearchFilter";
import { JwtPayload } from "jsonwebtoken";
import { StudentAdviser } from "@/types/studentAdviser";

interface ArchiviaClientProps {
  initialTheses: Thesis[];
  session: JwtPayload | null;
  categoryOptions: { key: string; label: string }[];
  userBookmarks?: number[];
  studentAdviser?: StudentAdviser | null;
}

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
    thesisCount,
  } = useArchivia(initialTheses);

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero />

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
            <div className="mb-3 sm:mb-0 text-gray-700">
              {isPending ? (
                "Searching..."
              ) : currentCategory === "all" ? (
                `Showing ${displayedTheses.length} of ${thesisCount} total theses`
              ) : (
                <>
                  Showing {displayedTheses.length} of {thesisCount} total theses
                  in{" "}
                  <span className="font-semibold text-black">
                    {currentCategory}
                  </span>
                </>
              )}
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-black font-medium hover:text-gray-700 transition-colors group"
            >
              Browse All
              <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isPending
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ThesisCardSkeleton key={i} />
                ))
              : displayedTheses.map((thesis) => (
                  <ThesisCard
                    key={thesis.id}
                    thesis={thesis}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    isInitiallyBookmarked={
                      thesis.id !== undefined &&
                      userBookmarks.includes(thesis.id)
                    }
                  />
                ))}
          </div>

          {!isPending && displayedTheses.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No theses found matching your search.</p>
              <p className="text-sm mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

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
