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
  if (totalPages <= 1) return null; // hide pagination if only one page

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 gap-y-3 pt-4 ">
      {/* Previous Button */}
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          className={`px-4 rounded ${
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
    </div>
  );
}
