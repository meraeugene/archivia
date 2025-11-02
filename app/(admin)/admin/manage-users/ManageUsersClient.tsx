"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomModal } from "@/components/admin/CustomModal";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { ManageUser } from "@/types/manageUser";
import { UseManageUsers } from "@/hooks/useManageUsers";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

export default function ManageUsersClient({
  users,
  page,
  totalPages,
}: {
  users: ManageUser[];
  page: number;
  totalPages: number;
}) {
  const {
    selectedUser,
    setSelectedUser,
    isAddOpen,
    setIsAddOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isEditOpen,
    setIsEditOpen,
    isLoading,
    setIsLoading,
    editData,
    setEditData,
    addData,
    setAddData,
    handleConfirmDelete,
  } = UseManageUsers();

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
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Left: Search and Sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search user by ID, name, or email"
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
              <SelectTrigger className="w-[150px] py-5 rounded cursor-pointer hover:bg-gray-100 border focus:ring-gray-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right: Add User Button */}
          <Button
            onClick={() => {
              setIsAddOpen(true);
              document.body.classList.add("modal-open");
            }}
            className="bg-black text-white py-5 hover:bg-gray-800 rounded shadow-sm transition-all"
          >
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <div className="mt-8 w-full bg-white rounded overflow-hidden border">
          <UsersTable
            filteredUsers={users}
            setIsEditOpen={setIsEditOpen}
            setSelectedUser={setSelectedUser}
            setEditData={setEditData}
            setIsDeleteOpen={setIsDeleteOpen}
          />
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Add User Modal */}
        <AddUserModal
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          addData={addData}
          setAddData={setAddData}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />

        {/* Edit Modal */}
        <EditUserModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          selectedUser={selectedUser}
          editData={editData}
          setEditData={setEditData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          isOpen={isDeleteOpen}
          title="Delete User"
          message={`Are you sure you want to delete "${
            selectedUser?.full_name || selectedUser?.user_id
          }"? This action cannot be undone.`}
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
