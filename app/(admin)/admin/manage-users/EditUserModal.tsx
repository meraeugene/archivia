"use client";

import { editUser } from "@/actions/admin/manageUsers";
import { CustomModal } from "@/components/admin/CustomModal";
import { Input } from "@/components/ui/input";
import { EditUserData, ManageUser } from "@/types/manageUser";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditUserModalProps {
  isEditOpen: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  selectedUser: ManageUser | null;
  editData: EditUserData;
  setEditData: Dispatch<SetStateAction<EditUserData>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const EditUserModal = ({
  isEditOpen,
  setIsEditOpen,
  selectedUser,
  editData,
  setEditData,
  isLoading,
  setIsLoading,
}: EditUserModalProps) => {
  const handleConfirmEdit = async () => {
    try {
      setIsLoading(true);
      if (selectedUser?.id) {
        await editUser({
          id: selectedUser.id,
          full_name: editData.full_name,
          password: editData.password,
          email: editData.email,
          role: editData.role,
        });
      }

      toast.success("User edited successfully!");
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to edit user.");
    } finally {
      setIsLoading(false);
      setIsEditOpen(false);
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
      title="Edit User"
      confirmText="Save Changes"
      isLoading={isLoading}
      onConfirm={handleConfirmEdit}
      onClose={handleClose}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            User ID <span className="text-gray-500">(cannot be changed)</span>
          </label>
          <Input
            name="user_id"
            value={editData.user_id}
            disabled
            className="border-gray-300 rounded "
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            New Password <span className="text-gray-500">(optional)</span>
          </label>
          <Input
            name="password"
            type="password"
            value={editData.password}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className="border-gray-300 rounded "
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Full Name
          </label>
          <Input
            name="full_name"
            value={editData.full_name}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                full_name: e.target.value,
              }))
            }
            className="border-gray-300 rounded "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Email
          </label>

          <Input
            name="email"
            value={editData.email}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border-gray-300 rounded "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Role
          </label>
          <Select
            onValueChange={(value) =>
              setEditData((prev) => ({ ...prev, role: value }))
            }
            value={editData.role}
          >
            <SelectTrigger className="w-full cursor-pointer hover:bg-gray-50 border-gray-300 rounded">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditUserModal;
