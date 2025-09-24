"use client";

import React from "react";
import { X, Check, XCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  type: "accept" | "reject";
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

const Modal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  studentName,
  onClose,
  onConfirm,
  isPending = false,
}) => {
  if (!isOpen) return null;

  const isAccept = type === "accept";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 relative">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isAccept ? (
              <Check className="text-white" size={28} />
            ) : (
              <XCircle className="text-white" size={28} />
            )}
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-8 space-y-5">
          <p className="text-gray-600 w-[80%] mx-auto">
            Are you sure you want to{" "}
            <span className="font-semibold text-black">
              {isAccept ? "accept" : "reject"}
            </span>{" "}
            this advisory request?
          </p>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-bold text-black text-lg">{studentName}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
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
              "Processing..."
            ) : isAccept ? (
              <>
                <Check size={18} />
                <span>Accept</span>
              </>
            ) : (
              <>
                <X size={18} />
                <span>Reject</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
