"use client";

import React from "react";
import { SendHorizonal, ShieldCheck } from "lucide-react";
import { Adviser } from "@/types/advisers";

type Props = {
  adviser: Adviser | null;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
};

const ConfirmModal = ({ adviser, onCancel, onConfirm, isPending }: Props) => {
  if (!adviser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-black">
            Confirm Leadership Role
          </h3>
        </div>

        <div className="text-center mb-10 space-y-3">
          <p className="text-gray-600">
            You are about to send a formal adviser request to
          </p>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-bold text-black text-lg">{adviser.full_name}</p>
          </div>
          <p className="text-gray-600 text-sm w-[80%] mx-auto">
            Please confirm that you are the{" "}
            <span className="font-semibold text-black">official leader</span> of
            your thesis group to proceed.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={onConfirm}
            className="flex-1 cursor-pointer px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 "
          >
            {isPending && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isPending ? (
              "Sending..."
            ) : (
              <div className="flex items-center gap-2">
                <SendHorizonal size={18} />
                <span>Send</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
