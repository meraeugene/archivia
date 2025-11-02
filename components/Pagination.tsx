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
    <div className="flex justify-center  gap-2 pt-4 lg:flex ">
      {/* Previous Button */}
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded lg:hidden"
      >
        Previous
      </Button>

      <div className="overflow-scroll flex gap-1 lg:overflow-auto lg:block lg:gap-0 lg:space-x-2 lg:space-y-2">
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
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded lg:hidden"
      >
        Next
      </Button>
    </div>
  );
}
