"use client";

import { BookOpen } from "lucide-react";
import { Thesis } from "@/types/thesis";
import { useThesisUpload } from "@/hooks/useThesisUpload";
import { StudentAdviser } from "@/types/studentAdviser";
import { FormField } from "./FormField";
import { CategorySelector } from "./CategorySelector";
import { useState } from "react";
import ConfirmThesisModal from "./ConfirmThesisModal";

interface UploadThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Thesis) => void;
  isPending: boolean;
  categories: { key: string; label: string }[];
  studentAdviser: StudentAdviser;
  isCancelPending: boolean;
}

const UploadThesisModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  categories,
  studentAdviser,
  isCancelPending,
}: UploadThesisModalProps) => {
  const { form, handleChange, errors, validate } = useThesisUpload();

  const [rawProponents, setRawProponents] = useState("");
  const [rawKeywords, setRawKeywords] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [thesisToConfirm, setThesisToConfirm] = useState<Thesis | null>(null);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    const finalForm = {
      ...form,
      adviser_name: form.adviser_name || studentAdviser.full_name || "",
      adviser_id: studentAdviser.adviser_id,
    };

    if (!validate(finalForm)) return; // validate first

    setThesisToConfirm(finalForm); // save validated form
    setIsConfirmOpen(true); // open preview
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center  bg-black/20 backdrop-blur-sm scrollbar-none  overflow-auto">
        <div className="bg-white   md:h-[95vh] overflow-auto  md:p-8 p-4 max-w-4xl w-full md:w-fit lg:w-full shadow-2xl border border-gray-200 ">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="gap-3 mb-2 flex flex-col items-center">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-black tracking-tight">
                Publish Thesis
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Fill in the details below to publish your thesis
            </p>
          </div>

          <div className="space-y-4  md:px-4">
            {/* Title */}
            <FormField
              label="Thesis Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
            />

            {/* Abstract */}
            <FormField
              label="Abstract"
              type="textarea"
              value={form.abstract}
              onChange={(e) => handleChange("abstract", e.target.value)}
              error={errors.abstract}
            />

            {/* Category (special) */}
            <CategorySelector
              form={form}
              handleChange={handleChange}
              categories={categories}
              error={errors.category}
            />

            {/* Proponents | Adviser */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Proponents (comma separated)"
                placeholder="e.g. John Doe, Jane Smith"
                value={rawProponents}
                onChange={(e) => {
                  const value = e.target.value;
                  setRawProponents(value);
                  handleChange(
                    "proponents",
                    value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  );
                }}
                error={errors.proponents}
              />

              <FormField
                label="Adviser"
                value={`${studentAdviser.prefix ?? ""} ${
                  studentAdviser.full_name
                } ${studentAdviser.suffix ?? ""}`.trim()}
                readOnly
              />
            </div>

            {/* Panel Chair | Panel Members */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Panel Chair"
                placeholder="e.g. John Harvey C. Babia"
                value={form.panel_member1}
                onChange={(e) => handleChange("panel_member1", e.target.value)}
                error={errors.panel_member1}
              />

              <FormField
                label="Panel Member 2"
                placeholder="e.g. Jane Doe"
                value={form.panel_member2}
                onChange={(e) => handleChange("panel_member2", e.target.value)}
                error={errors.panel_member2}
              />

              <FormField
                label="Panel Member 3"
                placeholder="e.g. John Smith"
                value={form.panel_member3}
                onChange={(e) => handleChange("panel_member3", e.target.value)}
                error={errors.panel_member3}
              />
            </div>

            {/* Keywords | Year of Publication*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Year of Publication"
                type="number"
                value={form.defense_year}
                onChange={(e) =>
                  handleChange("defense_year", parseInt(e.target.value, 10))
                }
                error={errors.defense_year}
              />

              <FormField
                label="Keywords (comma separated)"
                placeholder="e.g. machine learning, data science"
                value={rawKeywords}
                onChange={(e) => {
                  const value = e.target.value;
                  setRawKeywords(value);
                  handleChange(
                    "keywords",
                    value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  );
                }}
                error={errors.keywords}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8 md:px-4">
            <button
              disabled={isPending || isCancelPending}
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-700 font-medium transition-all  flex items-center justify-center gap-2 ${
                isCancelPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {isCancelPending ? (
                <>
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Cancelling...
                </>
              ) : (
                "Cancel"
              )}
            </button>
            <button
              onClick={handleConfirmClick}
              className=" flex-1  cursor-pointer px-5 py-3 rounded-md bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 "
            >
              Confirm
            </button>
            {/* <button
            disabled={isPending}
            onClick={handleSubmit}
            className={` flex-1  px-5 py-3 rounded-md bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2 ${
              isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isPending ? "Publishing..." : "Publish"}
          </button> */}
          </div>
        </div>
      </div>

      {thesisToConfirm && (
        <ConfirmThesisModal
          thesis={thesisToConfirm}
          isOpen={isConfirmOpen}
          onBack={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            onSubmit(thesisToConfirm);
          }}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default UploadThesisModal;
