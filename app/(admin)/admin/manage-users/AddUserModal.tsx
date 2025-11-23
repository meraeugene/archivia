"use client";

import { addUser } from "@/actions/admin/manageUsers";
import { CustomModal } from "@/components/admin/CustomModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isValidEmail } from "@/utils/isValidEmail";
import { Eye, EyeOff } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface AddUserModalProps {
  isAddOpen: boolean;
  setIsAddOpen: (isOpen: boolean) => void;
  addData: {
    user_id: string;
    password: string;
    role: string;
    full_name: string;
    email: string;
  };
  setAddData: Dispatch<
    SetStateAction<{
      user_id: string;
      password: string;
      role: string;
      full_name: string;
      email: string;
    }>
  >;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const AddUserModal = ({
  isAddOpen,
  setIsAddOpen,
  addData,
  setAddData,
  isLoading,
  setIsLoading,
}: AddUserModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = async () => {
    try {
      if (
        !addData.user_id ||
        !addData.password ||
        !addData.role ||
        !addData.full_name ||
        !addData.email
      ) {
        toast.error("Please fill in all fields");
        return;
      }

      // User ID must be numeric only
      if (!/^\d+$/.test(addData.user_id)) {
        toast.error("User ID must contain numbers only (e.g., 20250123)");
        return;
      }

      if (!isValidEmail(addData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setIsLoading(true);

      await addUser({
        user_id: addData.user_id,
        password: addData.password,
        role: addData.role,
        full_name: addData.full_name,
        email: addData.email,
      });

      toast.success("User added successfully!");

      setIsAddOpen(false);
      setAddData({
        user_id: "",
        password: "",
        role: "",
        full_name: "",
        email: "",
      });
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to add user.");
    } finally {
      setIsLoading(false);
      document.body.classList.remove("modal-open");
    }
  };

  const handleClose = () => {
    setIsAddOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <CustomModal
      isOpen={isAddOpen}
      title="Add New User"
      confirmText="Add User"
      onConfirm={handleConfirm}
      isLoading={isLoading}
      onClose={handleClose}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            User ID{" "}
          </label>

          <Input
            name="user_id"
            value={addData.user_id}
            onChange={(e) =>
              setAddData((prev) => ({ ...prev, user_id: e.target.value }))
            }
            className="border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Full Name{" "}
          </label>
          <Input
            name="full_name"
            value={addData.full_name}
            onChange={(e) =>
              setAddData((prev) => ({ ...prev, full_name: e.target.value }))
            }
            className="border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Email{" "}
          </label>
          <Input
            name="email"
            value={addData.email}
            onChange={(e) =>
              setAddData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700">
            Password
          </label>

          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={addData.password}
            onChange={(e) =>
              setAddData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className="border-gray-300 rounded pr-10" // add padding-right for icon
          />

          {/* Show/Hide Password Icon */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute cursor-pointer right-3 top-9 text-gray-500 hover:text-black transition"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-xs tracking-wide uppercase text-gray-700 ">
            Role{" "}
          </label>
          <Select
            onValueChange={(value) =>
              setAddData((prev) => ({ ...prev, role: value }))
            }
            value={addData.role}
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

export default AddUserModal;
