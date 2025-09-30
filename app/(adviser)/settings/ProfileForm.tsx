"use client";

import { updateAdviserProfile } from "@/actions/profile";
import { CurrentUser } from "@/types/currentUser";
import { Camera, User } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProfileFormProps {
  currentUser: CurrentUser | null;
}

export default function ProfileForm({ currentUser }: ProfileFormProps) {
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    prefix: currentUser?.prefix || "",
    full_name: currentUser?.full_name || "",
    suffix: currentUser?.suffix || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    position: currentUser?.position || "",
    highest_educational_attainment:
      currentUser?.highest_educational_attainment || "",
    research_interest: currentUser?.research_interest || "",
    handled_subjects: currentUser?.handled_subjects || "",
  });

  const [preview, setPreview] = useState<string | null>(
    currentUser?.profile_picture || null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const result = await updateAdviserProfile(form);
        if (result?.error) {
          toast.error(result.error);
          return;
        } else {
          toast.success("Profile updated successfully!");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <div className="bg-white rounded-lg border-gray-900 border-l-4 shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
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
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
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
                // onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Profile Picture</h4>
            <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
            <label
              htmlFor="profile-picture"
              className="text-sm text-gray-900 font-medium mt-2 hover:underline cursor-pointer"
            >
              Upload new picture
            </label>
          </div>
        </div>
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prefix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prefix
            </label>
            <input
              type="text"
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Suffix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suffix
            </label>
            <input
              type="text"
              name="suffix"
              value={form.suffix}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              rows={5}
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Highest Educational Attainment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Educational Attainment
            </label>
            <input
              type="text"
              name="highest_educational_attainment"
              value={form.highest_educational_attainment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Research Interest  */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Interest (comma separated)
            </label>
            <textarea
              rows={2}
              name="research_interest"
              value={form.research_interest}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Handled Subjects  */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Handled Subjects (comma separated)
            </label>
            <input
              type="text"
              name="handled_subjects"
              value={form.handled_subjects}
              onChange={handleChange}
              placeholder="e.g. Mathematics, Physics, Computer Science"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={pending}
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 cursor-pointer disabled:opacity-80 flex items-center justify-center gap-2 min-w-[140px]"
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
