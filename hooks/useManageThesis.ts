"use client";

import { deleteThesis } from "@/actions/admin/manageThesis";
import { EditableThesis, ManageThesis } from "@/types/manageThesis";
import { useState } from "react";
import { toast } from "sonner";

export function UseManageTheses() {
  const [selectedThesis, setSelectedThesis] = useState<ManageThesis | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState<EditableThesis>({
    title: "",
    abstract: "",
    keywords: [],
    proponents: [],
    adviser_id: "",
    adviser_name: "",
    defense_year: 0,
    category: [],
    file_url: "",
    panel_member1: "",
    panel_member2: "",
    panel_member3: "",
  });

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      if (selectedThesis?.id) {
        await deleteThesis(selectedThesis.id);
        toast.success("Thesis deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to delete thesis.");
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
      document.body.classList.remove("modal-open");
    }
  };

  return {
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
  };
}
