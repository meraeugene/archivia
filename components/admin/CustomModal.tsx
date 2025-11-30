"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  modalWidth?: string;
}

export function CustomModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  children,
  isLoading = false,
  modalWidth = "w-full max-w-md",
}: CustomModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div
        className={`bg-white overflow-hidden rounded-md p-8 shadow-2xl border border-gray-200 relative h-[90vh] flex flex-col ${modalWidth}`}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title & Message */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {message && <p className="text-gray-600 text-base mt-4">{message}</p>}
        </div>

        {/* Custom Content (Edit Form) */}
        {children && (
          <div className="mb-6 pb-6  scrollbar-none overflow-y-auto ">
            {children}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 cursor-pointer py-2 rounded border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 px-4 cursor-pointer py-2 rounded bg-black text-white font-semibold hover:bg-black/90 transition-all flex justify-center items-center gap-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
