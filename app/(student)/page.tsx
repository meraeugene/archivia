"use client";
import React, { useState } from "react";
import { thesesData } from "@/data/thesis";
import { Thesis } from "@/types/thesis";
import Hero from "@/sections/Hero";
import SearchFilter from "@/components/SearchFilter";
import ThesisCard from "@/components/ThesisCard";
import ThesisModal from "@/components/ThesisModal";
import { filterOptions, sortOptions } from "@/data/options";
import AdviserRecommender from "@/sections/AdviserRecommender";

const Archivia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]>("Relevance");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const displayedTheses = thesesData
    .filter((thesis) => {
      const matchesField =
        currentFilter === "all" || thesis.field === currentFilter;
      const matchesSearch =
        !searchQuery ||
        thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesField && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Date":
          return b.year - a.year;
        case "Title":
          return a.title.localeCompare(b.title);
        case "Author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  const handleBookmark = (thesis: Thesis) => {
    setBookmarkedIds(
      (prev) =>
        prev.includes(thesis.id)
          ? prev.filter((id) => id !== thesis.id) // remove if already bookmarked
          : [...prev, thesis.id] // add if not bookmarked
    );
  };

  const handlePreview = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const handleDownload = (thesis: Thesis) => {
    alert(`Downloading: ${thesis.title}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedThesis(null);
    document.body.classList.remove("modal-open");
  };

  return (
    <main className="min-h-screen  bg-white text-black ">
      {/* <div
        className=" inset-0 absolute z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #d8b4fe 100%)",
        }}
      /> */}

      <Hero />

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        filterOptions={filterOptions}
      />

      <section className="py-15 ">
        <div className="max-w-6xl mx-auto px-5 ">
          <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-lg  mb-3 sm:mb-0">
              Showing {displayedTheses.length} thesis
            </div>
            <div className="flex items-center gap-5">
              <span className="text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as (typeof sortOptions)[number])
                }
                className="px-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md  text-sm bg-white focus:outline-none "
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
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
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedIds.includes(thesis.id)}
              />
            ))}
          </div>

          {displayedTheses.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">
                No theses found matching your search criteria.
              </p>
              <p className="text-sm mt-2">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <AdviserRecommender />

      <ThesisModal
        thesis={selectedThesis}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={handleDownload}
      />
    </main>
  );
};

export default Archivia;
