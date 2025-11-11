/* eslint-disable @next/next/no-img-element */
"use client";

import { Upload } from "lucide-react";
import { getInitials } from "@/utils/getInitials";

export default function ProfileImage({
  name,
  imagePreview,
  isEditing,
  onFileSelect,
  onRemove,
}: {
  name: string;
  imagePreview: string;
  isEditing: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt={name}
          className="w-full h-[340px] object-cover border-8 "
        />
      ) : (
        <div className="w-full h-[340px] flex items-center justify-center text-white bg-black font-bold text-8xl tracking-tighter   border-8">
          {getInitials(name)}
        </div>
      )}

      {isEditing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 space-y-3">
          <label className="cursor-pointer text-white font-semibold flex flex-col items-center gap-2">
            <Upload className="w-6 h-6" />
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-400 cursor-pointer text-sm underline hover:text-red-200"
            >
              Remove Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
