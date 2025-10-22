"use client";

import React, { useState } from "react";
import { Check, XCircle, RotateCcw } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  type: "accept" | "reject" | "approve" | "return";
  studentName: string;
  onClose: () => void;
  onConfirm: (feedback?: string) => void;
  isPending?: boolean;
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  studentName,
  onClose,
  onConfirm,
  isPending = false,
}) => {
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setFeedback("");
    onClose();
  };

  // Determine modal texts based on type
  const getModalContent = () => {
    switch (type) {
      case "accept":
        return {
          action: "accept",
          subject: "this advisory request",
          label: "Add a note (optional)",
          placeholder: "Provide a note for the group thesis leader...",
          icon: <Check className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Accept",
        };
      case "reject":
        return {
          action: "reject",
          subject: "this advisory request",
          label: "Reason for rejection",
          placeholder: "Provide feedback to improve their thesis...",
          icon: <XCircle className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Reject",
        };
      case "approve":
        return {
          action: "approve",
          subject: "this thesis submission",
          label: "Add remarks (optional)",
          placeholder: "Provide remarks for the thesis group...",
          icon: <Check className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Approve",
        };
      case "return":
        return {
          action: "return",
          subject: "this thesis submission",
          label: "Reason for return",
          placeholder: "Provide feedback...",
          icon: <RotateCcw className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Return",
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 relative">
        {/* Icon */}
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 ${content.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
          >
            {content.icon}
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-8 space-y-5">
          <p className="text-gray-600 w-[80%] mx-auto">
            Are you sure you want to{" "}
            <span className="font-semibold text-black">{content.action}</span>{" "}
            {content.subject}?
          </p>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-bold text-black text-lg">{studentName}</p>
          </div>

          {/* Feedback textarea */}
          <div className="space-y-3">
            <label className="block text-left text-sm font-semibold text-black">
              {content.label}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={content.placeholder}
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-sm"
              rows={3}
              maxLength={300}
            />
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {feedback.length}/300
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={resetAndClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() => onConfirm(feedback.trim() || undefined)}
            className={`flex-1  px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 ${
              isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isPending ? (
              "Loading..."
            ) : (
              <>
                <span>{content.confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
