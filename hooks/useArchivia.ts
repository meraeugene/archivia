"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Thesis } from "@/types/thesis";
import { toast } from "sonner";
import { searchTheses, getMoreTheses, getThesesCount } from "@/actions/theses";

export function useArchivia(initialTheses?: Thesis[]) {
  const [displayedTheses, setDisplayedTheses] = useState<Thesis[]>(
    initialTheses || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [isPending, startTransition] = useTransition();

  const [offset, setOffset] = useState(initialTheses?.length || 0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [thesisCount, setThesisCount] = useState<number>(
    initialTheses?.length || 0
  );

  const fetchTotalCount = useCallback(async (category: string) => {
    const count = await getThesesCount(category);
    setThesisCount(count);
  }, []);

  // Reset list when clearing search
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
      setDisplayedTheses([]);
      setOffset(0);
      setHasMore(true);
      fetchTotalCount(newCategory);

      startTransition(async () => {
        const data = await getMoreTheses(0, sort, newCategory);
        setDisplayedTheses(data);
        setOffset(data.length);
        setHasMore(data.length > 0);
      });
    },
    [sort, fetchTotalCount]
  );

  useEffect(() => {
    if (currentCategory === "all") {
      // reset to default (initial theses)
      setDisplayedTheses(initialTheses || []);
      setOffset(initialTheses?.length || 0);
      setHasMore(true);
      fetchTotalCount("all");
    } else {
      handleCategoryChange(currentCategory);
    }
  }, [currentCategory, handleCategoryChange, initialTheses, fetchTotalCount]);

  // Search (always searches across all theses, ignoring category)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    startTransition(async () => {
      const { data, error } = await searchTheses(
        searchQuery,
        sort,
        currentCategory
      );
      if (error) {
        toast.error("Error searching theses");
      } else {
        const results = data || [];

        setDisplayedTheses(results);
        setOffset(results.length);
        setHasMore(false);

        // Update count based on search results
        setThesisCount(results.length);
      }
    });
  };

  // Sorting handler
  const handleSortChange = useCallback(
    async (newSort: string) => {
      setSort(newSort);
      setDisplayedTheses([]);
      setOffset(0);

      startTransition(async () => {
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

  const handleDownload = (thesis: Thesis) => {
    alert(`Downloading: ${thesis.title}`);
  };

  return {
    displayedTheses,
    isModalOpen,
    thesisCount,
    selectedThesis,
    searchQuery,
    currentCategory,
    sort,
    isPending,
    hasMore,
    loadingMore,
    setSearchQuery,
    setCurrentCategory,
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
