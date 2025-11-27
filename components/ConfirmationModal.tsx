"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Check,
  ChevronDown,
  CornerUpRight,
  LockOpen,
  RotateCcw,
  Star,
} from "lucide-react";
import { ReferredAdviser } from "@/types/referredAdvisers";
import { sortAdvisersByRecommendation } from "@/utils/sortedRecommendAdvisers";

interface ConfirmModalProps {
  isOpen: boolean;
  type: "accept" | "refer" | "approve" | "returned" | "reserve" | "authorize";
  studentName: string;
  onClose: () => void;
  onConfirm: (feedback?: string) => void;
  isPending?: boolean;
  referredAdvisers?: ReferredAdviser[];
  selectedAdviser?: {
    id: string;
    email: string;
    full_name: string;
  };
  setSelectedAdviser?: (adviser: {
    id: string;
    email: string;
    full_name: string;
  }) => void;
  recommendedAdviserIds?: string[];
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  studentName,
  onClose,
  onConfirm,
  isPending = false,
  referredAdvisers,
  selectedAdviser,
  setSelectedAdviser,
  recommendedAdviserIds,
}) => {
  const [feedback, setFeedback] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

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
      case "refer":
        return {
          action: "refer",
          subject: "this advisory request to another adviser",
          label: "Reason for referral.(optional)",
          placeholder: "Provide a note or reason for referring this request...",
          icon: <CornerUpRight className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Refer",
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
      case "returned":
        return {
          action: "return",
          subject: "this thesis submission",
          label: "Reason for return (required)",
          placeholder: "Provide feedback...",
          icon: <RotateCcw className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Return",
        };
      case "reserve":
        return {
          action: "reserve",
          label: "Reason for reservation",
          placeholder: "Provide feedback...",
          icon: <CalendarClock className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Reserve",
        };
      case "authorize":
        return {
          action: "authorize",
          subject: "this student leader to upload thesis",
          label: "Add a note (optional)",
          icon: <LockOpen className="text-white" size={28} />,
          iconBg: "bg-gray-900",
          confirmText: "Authorize",
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  const sortedAdvisers = sortAdvisersByRecommendation(
    referredAdvisers,
    recommendedAdviserIds
  );

  return (
    <div
      className="fixed  inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm  "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white  animate-fadeInScale rounded-lg p-8 max-w-md w-full shadow-2xl border border-gray-200 relative "
      >
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
          <p className="text-gray-600 w-[90%] mx-auto">
            {content.action === "reserve" ? (
              <>
                Are you sure about marking this as{" "}
                <span className="font-semibold text-black">reserved</span> ?{" "}
                <span className="text-gray-500">
                  This action cannot be undo once marked as reserved.
                </span>
              </>
            ) : (
              <>
                Are you sure you want to{" "}
                <span className="font-semibold text-black">
                  {content.action}{" "}
                </span>
                {content.subject}?
                {content.action === "authorize" && (
                  <span className="text-gray-500 block mt-2">
                    This action cannot be undo once authorized.
                  </span>
                )}
              </>
            )}
          </p>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-bold text-black text-lg">{studentName}</p>
          </div>

          {type === "refer" && (
            <div className="space-y-3 relative">
              <label className="block text-left text-sm font-semibold text-gray-600">
                Select Adviser to Refer
              </label>

              {/* Dropdown button */}
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-full p-3  cursor-pointer border border-gray-200 rounded-md text-sm flex justify-between items-center hover:ring focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white"
              >
                <span className="truncate text-gray-800">
                  {referredAdvisers?.find((a) => a.id === selectedAdviser?.id)
                    ?.full_name || "-- Select an adviser --"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown list */}
              {showDropdown && (
                <div className="absolute z-50  w-full max-h-64 overflow-y-auto bg-white border border-gray-200 scrollbar-none rounded-xl shadow-lg animate-in fade-in slide-in-from-top-1">
                  {referredAdvisers?.length === 0 ? (
                    <div className="p-3 text-gray-500 text-sm text-center">
                      No advisers available
                    </div>
                  ) : (
                    sortedAdvisers?.map((adviser) => (
                      <div
                        key={adviser.id}
                        onClick={() => {
                          setSelectedAdviser?.({
                            id: adviser.id,
                            email: adviser.email,
                            full_name: adviser.full_name,
                          });
                          setShowDropdown(false);
                        }}
                        className={`p-3 text-sm cursor-pointer  flex items-center transition hover:bg-gray-50
                        ${
                          selectedAdviser?.id === adviser.id
                            ? "bg-gray-100"
                            : ""
                        }
                      `}
                      >
                        <div className="flex flex-col  text-left w-full">
                          <div className="flex items-center justify-between  gap-2">
                            <span className="font-semibold text-gray-900">
                              {adviser.full_name}
                            </span>
                            {recommendedAdviserIds?.includes(adviser.id) && (
                              <p className="flex items-center  gap-1 text-yellow-500 text-xs font-medium">
                                <Star
                                  size={12}
                                  className="fill-yellow-500 text-yellow-500"
                                />
                                <span>Recommended</span>
                              </p>
                            )}
                          </div>

                          {/* Adviser email */}
                          <span className="text-gray-500 text-xs">
                            {adviser.email}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Feedback textarea */}
          {content.action !== "reserve" &&
            content.action !== "unauthorize" &&
            content.action !== "authorize" && (
              <div className="space-y-3">
                <label className="block text-left text-sm font-semibold text-gray-600">
                  {content.label}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={content.placeholder}
                  className="w-full p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all text-sm scrollbar-none"
                  rows={3}
                  maxLength={300}
                />
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {feedback.length}/300
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={resetAndClose}
            className="flex-1 px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() => onConfirm(feedback.trim() || undefined)}
            className={`flex-1  px-5 py-3 rounded-md bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 ${
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
