"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { Thesis } from "@/types/thesis";
import { toast } from "sonner";
import {
  getMoreTheses,
  getThesesCount,
  // searchTheses,
} from "@/actions/common/theses";
import { semanticSearchTheses } from "@/actions/common/semanticSearchTheses";

export function useArchivia(initialTheses?: Thesis[]) {
  const [displayedTheses, setDisplayedTheses] = useState<Thesis[]>(
    initialTheses || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string>("all");

  const [isSearching, startSearchTransition] = useTransition();
  const [isSorting, startSortTransition] = useTransition();
  const [isCategorizing, startCategoryTransition] = useTransition();

  const [offset, setOffset] = useState(initialTheses?.length || 0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [thesisCount, setThesisCount] = useState<number | null>(null);
  const [searchPage, setSearchPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  const fetchTotalCount = useCallback(
    async (category: string, year: number) => {
      const count = await getThesesCount(category, year);
      setThesisCount(count);
    },
    []
  );

  useEffect(() => {
    if (searchQuery === "") {
      setDisplayedTheses(initialTheses || []);
      setOffset(initialTheses?.length || 0);
      setHasMore(true);
      fetchTotalCount(currentCategory, selectedYear || 0);
    }
  }, [
    searchQuery,
    initialTheses,
    currentCategory,
    fetchTotalCount,
    selectedYear,
  ]);

  //  Fetch by category
  const handleCategoryChange = useCallback(
    async (newCategory: string) => {
      setCurrentCategory(newCategory);
      setOffset(0);
      setHasMore(true);

      startCategoryTransition(async () => {
        setDisplayedTheses([]);
        const data = await getMoreTheses(0, selectedYear, newCategory);
        setDisplayedTheses(data);
        setOffset(data.length);
        setHasMore(data.length > 0);
      });

      fetchTotalCount(newCategory, selectedYear || 0);
    },
    [selectedYear, fetchTotalCount]
  );

  // Search (always searches across all theses, ignoring category)
  const handleSearch = useCallback(
    async (query?: string) => {
      const trimmedQuery = query?.trim() ?? "";

      if (trimmedQuery === "") {
        setDisplayedTheses(initialTheses || []);
        setOffset(initialTheses?.length || 0);
        setHasMore(true);
        fetchTotalCount(currentCategory, selectedYear || 0);
        return;
      }

      startSearchTransition(async () => {
        // const { data, error } = await searchTheses(trimmedQuery);
        const { data, total, error } = await semanticSearchTheses(
          trimmedQuery,
          1
        );
        if (error) toast.error("Error searching theses");
        else {
          const results = data || [];
          setDisplayedTheses(results);
          setOffset(results.length);
          setSearchPage(1);
          setHasMore(results.length < total); // more pages if total > PAGE_SIZE
          setThesisCount(total);
        }
      });
    },
    [initialTheses, fetchTotalCount, currentCategory, selectedYear]
  );

  const handleYearChange = useCallback(
    async (year?: number) => {
      setSelectedYear(year);
      setDisplayedTheses([]);
      setOffset(0);
      setHasMore(true);

      startSortTransition(async () => {
        const filtered = await getMoreTheses(0, year, currentCategory);
        setDisplayedTheses(filtered);
        setOffset(filtered.length);
        setHasMore(filtered.length > 0);
      });
    },
    [currentCategory]
  );

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    if (searchQuery.trim()) {
      const nextPage = searchPage + 1;
      const { data, total, error } = await semanticSearchTheses(
        searchQuery,
        nextPage
      );
      if (!error && data?.length) {
        setDisplayedTheses((prev) => {
          const updated = [...prev, ...data];
          setHasMore(updated.length < total);
          return updated;
        });
        setSearchPage(nextPage);
      } else {
        setHasMore(false);
      }
    } else {
      const newTheses = await getMoreTheses(
        offset,
        selectedYear,
        currentCategory
      );
      if (newTheses.length === 0) setHasMore(false);
      setDisplayedTheses((prev) => [...prev, ...newTheses]);
      setOffset((prev) => prev + newTheses.length);
    }

    setLoadingMore(false);
  }, [
    loadingMore,
    hasMore,
    searchQuery,
    searchPage,
    offset,
    selectedYear,
    currentCategory,
  ]);

  const handlePreview = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedThesis(null);
    document.body.classList.remove("modal-open");
  };

  const handleDownload = async (thesis: Thesis) => {
    if (!thesis.file_url) return;

    try {
      const response = await fetch(thesis.file_url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      // Use a name ending with .pdf
      link.download = (thesis.title || "thesis") + ".pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return {
    displayedTheses,
    isModalOpen,
    thesisCount,
    selectedThesis,
    searchQuery,
    currentCategory,
    isSearching,
    isSorting,
    isCategorizing,
    hasMore,
    loadingMore,
    setSearchQuery,
    selectedYear,
    handleSearch,
    handleYearChange,
    handlePreview,
    closeModal,
    loadMore,
    handleCategoryChange,
    handleDownload,
  };
}
