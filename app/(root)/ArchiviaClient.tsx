"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Thesis } from "@/types/thesis";
import Hero from "@/sections/Hero";
import ThesisCard from "@/components/ThesisCard";
import ThesisModal from "@/components/ThesisModal";
import AdviserRecommender from "@/sections/AdviserRecommender";
import Link from "next/link";
import SearchFilter from "@/components/SearchFilter";
import { filterOptions } from "@/data/options";
import { toast } from "sonner";
import { searchTheses } from "@/actions/theses";
import { ArrowRight } from "lucide-react";
import ThesisCardSkeleton from "@/components/ThesisCardSkeleton";

interface ArchiviaClientProps {
  initialTheses: Thesis[];
}

const ArchiviaClient: React.FC<ArchiviaClientProps> = ({ initialTheses }) => {
  const [displayedTheses, setDisplayedTheses] =
    useState<Thesis[]>(initialTheses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("recent");
  const [isPending, startTransition] = useTransition();

  // Reset to initial theses if search input is cleared
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDisplayedTheses(initialTheses);
    }
  }, [searchQuery, initialTheses]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // ignore empty search
    startTransition(async () => {
      const { data, error } = await searchTheses(searchQuery, currentFilter);
      if (error) {
        toast.error("Error searching theses");
      } else {
        setDisplayedTheses(data || []);
      }
    });
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
    <main className="min-h-screen bg-white text-black">
      <Hero />

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        filterOptions={filterOptions}
        onSearch={handleSearch}
      />

      <section className="py-15">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="  mb-3 sm:mb-0">
              {isPending
                ? "Searching..."
                : `Showing ${displayedTheses.length} theses`}
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

export default ArchiviaClient;
