"use client";

import { CustomModal } from "@/components/admin/CustomModal";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { EditableThesis, ManageThesis } from "@/types/manageThesis";
import { editThesis } from "@/actions/admin/manageThesis";

interface EditThesisModalProps {
  isEditOpen: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  selectedThesis: ManageThesis | null;
  editData: EditableThesis;
  setEditData: Dispatch<SetStateAction<EditableThesis>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const EditThesisModal = ({
  isEditOpen,
  setIsEditOpen,
  selectedThesis,
  editData,
  setEditData,
  isLoading,
  setIsLoading,
}: EditThesisModalProps) => {
  const handleConfirmEdit = async () => {
    if (!selectedThesis?.id) return;

    try {
      setIsLoading(true);
      await editThesis({
        id: selectedThesis.id,
        title: editData.title || selectedThesis.title,
        abstract: editData.abstract ?? selectedThesis.abstract,
        keywords: editData.keywords ?? selectedThesis.keywords,
        proponents: editData.proponents ?? selectedThesis.proponents,
        adviser_id: editData.adviser_id ?? selectedThesis.adviser_id,
        adviser_name: editData.adviser_name ?? selectedThesis.adviser_name,
        defense_year: editData.defense_year ?? selectedThesis.defense_year,
        category: editData.category ?? selectedThesis.category,
        file_url: editData.file_url ?? selectedThesis.file_url,
        panel_member1: editData.panel_member1 ?? selectedThesis.panel_member1,
        panel_member2: editData.panel_member2 ?? selectedThesis.panel_member2,
        panel_member3: editData.panel_member3 ?? selectedThesis.panel_member3,
      });
      toast.success("Thesis updated successfully!");
      setIsEditOpen(false);
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to update thesis.");
    } finally {
      setIsLoading(false);
      document.body.classList.remove("modal-open");
    }
  };

  const handleClose = () => {
    setIsEditOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <CustomModal
      isOpen={isEditOpen}
      title="Edit Thesis"
      confirmText="Save Changes"
      onConfirm={handleConfirmEdit}
      isLoading={isLoading}
      onClose={handleClose}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Title
          </label>
          <Input
            placeholder="Title"
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Adviser
          </label>
          <Input
            placeholder="Adviser Name"
            value={editData.adviser_name || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, adviser_name: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Panel Chair
          </label>
          <Input
            placeholder="Panel Chair Name"
            value={editData.panel_member1 || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                panel_member1: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Panel Member 2
          </label>
          <Input
            placeholder="Panel Member 2"
            value={editData.panel_member2 || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                panel_member2: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Panel Member 3
          </label>
          <Input
            placeholder="Panel Member 3"
            value={editData.panel_member3 || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                panel_member3: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Proponents <span className="text-gray-500">(comma separated)</span>
          </label>
          <Input
            placeholder="Proponents"
            value={editData.proponents?.join(", ") || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                proponents: e.target.value
                  .split(",")
                  .map((s: string) => s.trim()),
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Year
          </label>
          <Input
            type="number"
            placeholder="Defense Year"
            value={editData.defense_year || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                defense_year: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default EditThesisModal;
