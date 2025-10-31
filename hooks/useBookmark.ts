"use client";

import { toggleBookmark } from "@/actions/common/toggleBookmark";
import { useState } from "react";
import { toast } from "sonner";

export function useBookmark(thesisId: number, initialBookmarked = false) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    const newState = !isBookmarked;

    // Optimistic update
    setIsBookmarked(newState);

    // Show toast immediately
    if (newState) {
      toast.success("Added to bookmarks");
    }

    try {
      setIsPending(true);
      await toggleBookmark(thesisId);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      setIsBookmarked(!newState);
      toast.error("Failed to toggle bookmark");
    } finally {
      setIsPending(false);
    }
  };

  return { isBookmarked, handleToggle, isPending };
}
