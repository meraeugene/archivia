"use client";

import { CurrentUser } from "@/types/currentUser";
import { Mail, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import ProfileImage from "./ProfileImage";
import FacultyAcademicInfo from "./FacultyAcademicInfo";
import { ActionButton } from "./ActionButton";
import ChangePasswordForm from "./ChangePasswordForm";

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
    <div className="bg-black relative  text-white">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-gray-700 rounded-full blur-[120px] animate-pulse"
          style={{
            transition: "transform 0.5s ease-out",
            animationDelay: "1.5s",
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]  pointer-events-none"></div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black  pointer-events-none"></div>

      <main className="max-w-6xl mx-auto  md:py-16 py-12">
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
              <div className="mt-8 p-6 border ">
                <label className="block text-sm font-bold mb-1">EMAIL</label>
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
                <div className="mt-8 md:p-6 p-4 border border-gray-800 ">
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
              <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-none">
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

        {/* Student Password Change Section */}
        {!isFaculty && (
          <div className="md:mt-16 mt-12 md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Change Password</h2>
            <ChangePasswordForm />
          </div>
        )}
      </main>
    </div>
  );
}
