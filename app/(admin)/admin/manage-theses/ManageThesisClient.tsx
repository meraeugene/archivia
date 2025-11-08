"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomModal } from "@/components/admin/CustomModal";
import { Search } from "lucide-react";
import { ManageThesis } from "@/types/manageThesis";
import { UseManageTheses } from "@/hooks/useManageThesis";
import ThesesTable from "./ThesisTable";
import EditThesisModal from "./EditThesisModal";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

export default function ManageThesisClient({
  theses,
  page,
  totalPages,
  limit,
}: {
  theses: ManageThesis[];
  page: number;
  totalPages: number;
  limit: number;
}) {
  const {
    selectedThesis,
    setSelectedThesis,
    isDeleteOpen,
    setIsDeleteOpen,
    isEditOpen,
    setIsEditOpen,
    isLoading,
    setIsLoading,
    editData,
    setEditData,
    handleConfirmDelete,
  } = UseManageTheses();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-8 py-4  bg-white shadow-xs">
        <h1 className="text-xl font-bold text-gray-900">Manage Theses</h1>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative md:w-[300px] w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by title or adviser"
              className="w-full py-5 pl-9 rounded border focus:ring-gray-500"
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                params.set("search", e.target.value);
                params.set("page", "1");
                router.push(`?${params.toString()}`);
              }}
            />
          </div>

          <Select
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams);
              params.set("sortBy", value);
              router.push(`?${params.toString()}`);
            }}
            defaultValue={searchParams.get("sortBy") || "newest"}
          >
            <SelectTrigger className="md:w-[150px] w-full py-5 rounded cursor-pointer hover:bg-gray-100 border focus:ring-gray-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="adviser">Adviser</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theses Table */}
        <div className="mt-8 w-full bg-white rounded overflow-scroll lg:overflow-hidden border">
          <ThesesTable
            filteredTheses={theses}
            setIsEditOpen={setIsEditOpen}
            setSelectedThesis={setSelectedThesis}
            setEditData={setEditData}
            setIsDeleteOpen={setIsDeleteOpen}
            page={page}
            limit={limit}
          />
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Edit Thesis Modal */}
        <EditThesisModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          selectedThesis={selectedThesis}
          editData={editData}
          setEditData={setEditData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          isOpen={isDeleteOpen}
          title="Delete Thesis"
          message={`Are you sure you want to delete this thesis? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isLoading}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setIsDeleteOpen(false);
            document.body.classList.remove("modal-open");
          }}
        />
      </div>
    </main>
  );
}
