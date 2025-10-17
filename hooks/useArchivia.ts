"use client";

import { useState, useEffect, useTransition } from "react";
import { Thesis } from "@/types/thesis";
import { toast } from "sonner";
import { searchTheses } from "@/actions/theses";

export function useArchivia(initialTheses: Thesis[]) {
  const [displayedTheses, setDisplayedTheses] =
    useState<Thesis[]>(initialTheses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("recent");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDisplayedTheses(initialTheses);
    }
  }, [searchQuery, initialTheses]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    startTransition(async () => {
      const { data, error } = await searchTheses(searchQuery, currentFilter);
      if (error) toast.error("Error searching theses");
      else setDisplayedTheses(data || []);
    });
  };

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
    // states
    displayedTheses,
    isModalOpen,
    selectedThesis,
    searchQuery,
    currentFilter,
    isPending,

    // setters
    setSearchQuery,
    setCurrentFilter,

    // actions
    handleSearch,
    handlePreview,
    handleDownload,
    closeModal,
  };
}
