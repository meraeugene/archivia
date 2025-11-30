"use client";

import { Input } from "@/components/ui/input";
import { CustomModal } from "@/components/admin/CustomModal";
import { useState } from "react";
import { toast } from "sonner";
import { setAdviserLimit } from "@/actions/admin/setAdviserLimit";

interface SetLimitModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  adviser_id: string;
  currentLimit: number;
}

export const SetLimitModal = ({
  isOpen,
  setIsOpen,
  adviser_id,
  currentLimit,
}: SetLimitModalProps) => {
  const [limit, setLimit] = useState(currentLimit || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const res = await setAdviserLimit(adviser_id, limit);
    setIsLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Advisee limit updated!");
      setIsOpen(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      title="Set Advisee Limit"
      confirmText="Save"
      onConfirm={handleConfirm}
      isLoading={isLoading}
      onClose={() => setIsOpen(false)}
    >
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">Maximum Advisees</label>
        <Input
          type="number"
          min={0}
          value={Number.isNaN(limit) ? "" : limit} // ✅ Prevent NaN crash
          onChange={(e) => setLimit(parseInt(e.target.value))}
        />
      </div>
    </CustomModal>
  );
};
