"use client";

import { useAdviserProfileEditor } from "@/hooks/useAdviserProfileEditor";
import { CurrentUser } from "@/types/currentUser";
import { Camera, User } from "lucide-react";
import { InputField } from "./InputField";
import { TextAreaField } from "./TextAreaField";
import { getInitials } from "@/utils/getInitials";
import { ProfileFormFields } from "@/data/profileFormFields";
import { HandledSubjectsSelector } from "./HandledSubjectsSelector";
import { ResearchInterestSelector } from "./ResearchInterestSelector";

interface ProfileFormProps {
  currentUser: CurrentUser | null;
}

export default function ProfileForm({ currentUser }: ProfileFormProps) {
  const {
    formData,
    imagePreview,
    isUploading,
    pending,
    handleChange,
    handleFileSelect,
    handleSave,
    handleRemovePicture,
    handleCancel,
  } = useAdviserProfileEditor(currentUser!);

  return (
    <div className="bg-white rounded-lg  border shadow-xs hover:shadow-sm border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Profile Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Update your personal information and profile picture.
        </p>
      </div>

      <div className="p-6">
        {/* Profile picture */}
        <div className="flex items-center space-x-6 mb-6  flex-wrap gap-4 lg:gap-0">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-[340px] flex items-center justify-center text-white bg-black font-bold text-3xl tracking-tighter">
                  {getInitials(currentUser?.full_name)}
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <label
              htmlFor="profile-picture"
              className="absolute -bottom-1 -right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Camera className="h-3 w-3" />
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Profile Picture</h4>
            <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>

            <div className="flex items-center gap-3 mt-2">
              <label
                htmlFor="profile-picture"
                className="text-sm text-gray-900 font-medium hover:underline cursor-pointer"
              >
                Upload new picture
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="text-sm text-red-600 font-medium hover:underline cursor-pointer"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ProfileFormFields.map(({ label, name, type }) => (
            <InputField
              key={name}
              label={label}
              name={name}
              type={type}
              value={formData[name as keyof typeof formData] as string}
              onChange={handleChange}
            />
          ))}

          <TextAreaField
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={10}
          />

          {/* <TextAreaField
            label="Research Interest (comma separated)"
            name="research_interest"
            value={formData.research_interest}
            onChange={handleChange}
            rows={5}
          /> */}
        </div>

        <div className="mt-6 xl:w-1/2">
          <ResearchInterestSelector
            value={formData.research_interest}
            handleChange={(name, value) =>
              handleChange({
                target: { name, value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </div>

        <div className="mt-6 xl:w-1/2">
          <HandledSubjectsSelector
            value={formData.handled_subjects}
            handleChange={(name, value) =>
              handleChange({
                target: { name, value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </div>

        {/* <div className="mt-6">
          <InputField
            label="Handled Subjects (comma separated)"
            name="handled_subjects"
            value={formData.handled_subjects}
            onChange={handleChange}
            placeholder="e.g. Mathematics, Physics, Computer Science"
          />
        </div> */}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 md:py-3 cursor-pointer border border-gray-100 shadow-xs text-gray-700 rounded-lg font-medium hover:shadow-sm transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={pending}
            className="px-6 py-2 md:py-3 rounded-lg font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 cursor-pointer disabled:opacity-80 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {pending && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
