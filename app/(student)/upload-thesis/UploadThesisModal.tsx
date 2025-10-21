"use client";

import { BookOpen, UploadCloud } from "lucide-react";
import { submitThesisFields } from "@/data/submitThesisFields";
import { Thesis } from "@/types/thesis";
import { useThesisUpload } from "@/hooks/useThesisUpload";

interface UploadThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Thesis) => void;
  isPending: boolean;
}

const UploadThesisModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: UploadThesisModalProps) => {
  const { form, handleChange, errors, validate } = useThesisUpload();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-gray-200">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="gap-3 mb-2 flex flex-col items-center">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-black tracking-tight">
              Submit Thesis
            </h3>
          </div>
          <p className="text-gray-500 text-sm">
            Fill in the details below to submit your thesis
          </p>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Abstract spans both columns */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Abstract
            </label>
            <textarea
              rows={7}
              className={`w-full border p-2 rounded resize-none ${
                errors.abstract ? "border-red-500" : ""
              }`}
              value={form.abstract}
              onChange={(e) => handleChange("abstract", e.target.value)}
            />
            {errors.abstract && (
              <span className="text-red-500 text-xs">{errors.abstract}</span>
            )}
          </div>

          {/* Remaining fields in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submitThesisFields.map((field) => {
              const value = form[field.key as keyof Thesis];
              const isArray = field.isArray ?? false;
              const key = field.key as keyof Thesis;

              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    className={`w-full border p-2 rounded ${
                      errors[key] ? "border-red-500" : ""
                    }`}
                    value={isArray ? (value as string[]).join(", ") : value}
                    onChange={(e) =>
                      handleChange(
                        key,
                        isArray
                          ? e.target.value.split(",").map((v) => v.trim())
                          : field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                  {errors[key] && (
                    <span className="text-red-500 text-xs">{errors[key]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={handleSubmit}
            className={` flex-1  px-5 py-3 rounded-md bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 ${
              isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <UploadCloud size={18} />
            )}
            {isPending ? "Submitting..." : "Submit Thesis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadThesisModal;
