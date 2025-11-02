"use client";

import { deleteUser } from "@/actions/admin/manageUsers";
import { ManageUser } from "@/types/manageUser";
import { useState } from "react";
import { toast } from "sonner";

export function UseManageUsers() {
  const [selectedUser, setSelectedUser] = useState<ManageUser | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState({
    user_id: "",
    full_name: "",
    email: "",
    password: "",
    role: "",
  });

  const [addData, setAddData] = useState({
    user_id: "",
    password: "",
    role: "",
    full_name: "",
    email: "",
  });

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      if (selectedUser?.id) {
        await deleteUser(selectedUser.id);
      }
      toast.success("User deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to delete user.");
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
      document.body.classList.remove("modal-open");
    }
  };

  return {
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
  };
}
