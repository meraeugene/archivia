"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we are near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex justify-center items-center gap-2 pt-6 flex-wrap">
      {/* First Button */}
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        className="rounded"
      >
        First
      </Button>

      {/* Previous Button */}
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded"
      >
        Prev
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          className={`px-3 rounded ${
            p === page ? "bg-black text-white hover:bg-gray-800" : ""
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded"
      >
        Next
      </Button>

      {/* Last Button */}
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="rounded"
      >
        Last
      </Button>
    </div>
  );
}
