"use client";

import { CurrentUser } from "@/types/currentUser";
import { Mail, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import ProfileImage from "./ProfileImage";
import FacultyAcademicInfo from "./FacultyAcademicInfo";
import { ActionButton } from "./ActionButton";

export default function ProfilePageClient({
  profile,
}: {
  profile: CurrentUser;
}) {
  const router = useRouter();
  const isFaculty = profile.role === "faculty";

  const {
    formData,
    imagePreview,
    isEditing,
    setIsEditing,
    isUploading,
    handleChange,
    handleFileSelect,
    handleRemovePicture,
    handleSave,
  } = useProfileEditor(profile);

  const handleEditProfileClick = () => {
    if (isFaculty) {
      router.push(`/settings`);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white">
      <main className="max-w-6xl mx-auto px-5 py-16">
        {/* Profile Header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <ProfileImage
              name={profile.full_name}
              imagePreview={imagePreview}
              isEditing={isEditing}
              onFileSelect={handleFileSelect}
              onRemove={handleRemovePicture}
            />

            {/* Quick Contact */}
            {isEditing ? (
              <div className="mt-8 p-6 border border-black">
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2"
                />
              </div>
            ) : (
              profile.email && (
                <div className="mt-8 p-6 border border-black">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:underline break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2">
            {/* Name */}
            <div className="mb-8">
              <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-none">
                {profile.prefix} {profile.full_name} {profile.suffix}
              </h1>

              {/* Faculty position */}
              {isFaculty && profile.position && (
                <p className="text-2xl tracking-wide uppercase font-light border-l-4 border-black pl-6 ml-6">
                  {profile.position}
                </p>
              )}

              {/* Student info */}
              {!isFaculty && (
                <div className="space-y-4 mt-6">
                  {/* Course */}
                  <div className="text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Course
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 mt-1"
                      />
                    ) : (
                      <div className="text-2xl mt-1">
                        {profile.course ?? "To be provided"}
                      </div>
                    )}
                  </div>

                  {/* Year & Section */}
                  <div className="text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Year & Section
                    </span>
                    {isEditing ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          name="year_level"
                          value={formData.year_level}
                          onChange={handleChange}
                          placeholder="Year"
                          className="w-1/2 border px-3 py-2"
                        />
                        <input
                          type="text"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="Section"
                          className="w-1/2 border px-3 py-2"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl mt-1">
                        {profile.year_level && profile.section
                          ? `${profile.year_level}${profile.section}`
                          : "To be provided"}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Bio
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 mt-1"
                      />
                    ) : (
                      <div className="text-2xl mt-1">
                        {profile.bio ?? "To be provided"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            {isFaculty && profile.bio && !isEditing && (
              <div className="mb-8">
                <p className="text-lg leading-relaxed font-light">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Buttons */}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <ActionButton
                  label="Cancel"
                  onClick={() => setIsEditing(false)}
                  icon={<X className="w-4 h-4" />}
                  hover="rotate-90"
                />
                <ActionButton
                  label={isUploading ? "Saving..." : "Save"}
                  onClick={handleSave}
                  disabled={isUploading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  hover="translate-x-2"
                />
              </div>
            ) : (
              <ActionButton
                label="Edit Profile"
                onClick={handleEditProfileClick}
                icon={<ArrowRight className="w-4 h-4" />}
                hover="translate-x-2"
              />
            )}
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-black"></div>
          <div className="w-2 h-2 bg-black rotate-45"></div>
          <div className="flex-1 h-px bg-black"></div>
        </div>

        {/* Faculty Academic Info */}
        {isFaculty && <FacultyAcademicInfo profile={profile} />}
      </main>
    </div>
  );
}
