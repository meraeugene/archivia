"use client";

import { CustomModal } from "@/components/admin/CustomModal";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { EditableThesis, ManageThesis } from "@/types/manageThesis";
import { editThesis } from "@/actions/admin/manageThesis";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "./TagInput";

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
      modalWidth="w-[40%]"
    >
      <div className="space-y-4  ">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
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

        {/* Abstract */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            Abstract
          </label>
          <Textarea
            placeholder="Abstract"
            value={editData.abstract || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, abstract: e.target.value }))
            }
            rows={4}
          />
        </div>

        {/* Adviser */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
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

        {/* Panel Members */}
        {["Panel Chair", "Panel Member 2", "Panel Member 3"].map(
          (label, idx) => (
            <div key={label} className="flex flex-col gap-2">
              <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
                {label}
              </label>
              <Input
                placeholder={label}
                value={
                  idx === 0
                    ? editData.panel_member1 || ""
                    : idx === 1
                    ? editData.panel_member2 || ""
                    : editData.panel_member3 || ""
                }
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    panel_member1:
                      idx === 0 ? e.target.value : prev.panel_member1,
                    panel_member2:
                      idx === 1 ? e.target.value : prev.panel_member2,
                    panel_member3:
                      idx === 2 ? e.target.value : prev.panel_member3,
                  }))
                }
              />
            </div>
          )
        )}

        {/* Keywords */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            Keywords
          </label>
          <TagInput
            value={editData.keywords || []}
            setValue={(val) =>
              setEditData((prev) => ({ ...prev, keywords: val }))
            }
            placeholder="Type a keyword and press Enter"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            Category
          </label>

          <TagInput
            value={editData.category || []}
            setValue={(val) =>
              setEditData((prev) => ({ ...prev, category: val }))
            }
            placeholder="Type a category and press Enter"
          />
        </div>

        {/* Proponents */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            Proponents
          </label>
          <TagInput
            value={editData.proponents || []}
            setValue={(val) =>
              setEditData((prev) => ({ ...prev, proponents: val }))
            }
            placeholder="Type a proponent and press Enter"
          />
        </div>

        {/* Year */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
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

        {/* File URL */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            File URL
          </label>
          <Input
            placeholder="File URL"
            value={editData.file_url || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, file_url: e.target.value }))
            }
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default EditThesisModal;
