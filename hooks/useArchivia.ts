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
  const [sort, setSort] = useState("recent");

  const [isSearching, startSearchTransition] = useTransition();
  const [isSorting, startSortTransition] = useTransition();
  const [isCategorizing, startCategoryTransition] = useTransition();

  const [offset, setOffset] = useState(initialTheses?.length || 0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [thesisCount, setThesisCount] = useState<number | null>(null);

  const fetchTotalCount = useCallback(async (category: string) => {
    const count = await getThesesCount(category);
    setThesisCount(count);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDisplayedTheses(initialTheses || []);
      setOffset(initialTheses?.length || 0);
      setHasMore(true);
      fetchTotalCount(currentCategory);
    }
  }, [searchQuery, initialTheses, currentCategory, fetchTotalCount]);

  //  Fetch by category
  const handleCategoryChange = useCallback(
    async (newCategory: string) => {
      setCurrentCategory(newCategory);
      setOffset(0);
      setHasMore(true);

      startCategoryTransition(async () => {
        setDisplayedTheses([]);
        const data = await getMoreTheses(0, sort, newCategory);
        setDisplayedTheses(data);
        setOffset(data.length);
        setHasMore(data.length > 0);
      });

      fetchTotalCount(newCategory);
    },
    [sort, fetchTotalCount]
  );

  // Search (always searches across all theses, ignoring category)
  const handleSearch = useCallback(
    async (query?: string) => {
      const trimmedQuery = query?.trim() ?? "";

      if (trimmedQuery === "") {
        setDisplayedTheses(initialTheses || []);
        setOffset(initialTheses?.length || 0);
        setHasMore(true);
        fetchTotalCount(currentCategory);
        return;
      }

      startSearchTransition(async () => {
        // const { data, error } = await searchTheses(trimmedQuery);
        const { data, error } = await semanticSearchTheses(trimmedQuery);
        if (error) toast.error("Error searching theses");
        else {
          const results = data || [];
          setDisplayedTheses(results);
          setOffset(results.length);
          setHasMore(false);
          setThesisCount(results.length);
        }
      });
    },
    [initialTheses, fetchTotalCount, currentCategory]
  );

  // Sorting handler
  const handleSortChange = useCallback(
    async (newSort: string) => {
      setSort(newSort);
      setDisplayedTheses([]);
      setOffset(0);

      startSortTransition(async () => {
        const sorted = await getMoreTheses(0, newSort, currentCategory);
        setDisplayedTheses(sorted);
        setOffset(sorted.length);
        setHasMore(sorted.length > 0);
      });
    },
    [currentCategory]
  );

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || searchQuery.trim()) return;
    setLoadingMore(true);

    const newTheses = await getMoreTheses(offset, sort, currentCategory);
    if (newTheses.length === 0) setHasMore(false);

    setDisplayedTheses((prev) => [...prev, ...newTheses]);
    setOffset((prev) => prev + newTheses.length);
    setLoadingMore(false);
  }, [offset, hasMore, loadingMore, searchQuery, sort, currentCategory]);

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
    sort,
    isSearching,
    isSorting,
    isCategorizing,
    hasMore,
    loadingMore,
    setSearchQuery,
    setSort,
    handleSearch,
    handlePreview,
    handleSortChange,
    closeModal,
    loadMore,
    handleCategoryChange,
    handleDownload,
  };
}
