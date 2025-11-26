"use client";

import { CurrentUser } from "@/types/currentUser";
import { Mail, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import ProfileImage from "./ProfileImage";
import FacultyAcademicInfo from "./FacultyAcademicInfo";
import { ActionButton } from "./ActionButton";
import ChangePasswordForm from "./ChangePasswordForm";
import Decoratives from "./Decoratives";
import DecorativeFooter from "./DecorativeFooter";
import { UserSession } from "@/types/userSession";
import ManageAccessDevices from "./ManageAccessDevices";

export default function ProfilePageClient({
  profile,
  sessions,
}: {
  profile: CurrentUser;
  sessions: UserSession[] | null;
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
    <div className="bg-black relative overflow-hidden  text-white px-5 md:px-6 ">
      <Decoratives />

      <main className="max-w-6xl mx-auto  md:py-16 py-12">
        {/* Profile Header */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 md:mb-16">
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
              <div className="mt-8 hidden md:block ">
                <label className="block text-sm font-bold mb-1">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
            ) : (
              profile.email && (
                <div className="mt-8 md:block md:p-6 p-4 border border-gray-800 hidden ">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                    <p className="h">{profile.email}</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2">
            {/* Name */}
            <div className="mb-8">
              <h1 className="text-3xl text-center md:text-left lg:text-7xl font-black tracking-tight leading-none">
                {profile.prefix} {profile.full_name} {profile.suffix}
              </h1>

              {/* Faculty position */}
              {isFaculty && profile.position && (
                <p className="text-2xl text-center tracking-wide md:hidden uppercase font-light border-l-4 border-black md:pl-6 md:ml-6 mt-2 md:text-left ">
                  {profile.position}
                </p>
              )}

              {isEditing ? (
                <div className="mt-8  md:hidden  ">
                  <label className="block text-sm font-bold mb-1">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              ) : (
                profile.email && (
                  <div className="mt-8 md:p-6 p-4 border border-gray-800 md:hidden ">
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

              {/* Faculty position */}
              {isFaculty && profile.position && (
                <p className="text-2xl text-center tracking-wide hidden md:block uppercase font-light border-l-4 border-black md:pl-6 md:ml-6 mt-2 md:text-left ">
                  {profile.position}
                </p>
              )}

              {/* Student info */}
              {!isFaculty && (
                <div className="space-y-4 mt-6">
                  {/* Course */}
                  <div className="md:text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Course
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                      />
                    ) : (
                      <div className="md:text-2xl mt-1">
                        {profile.course ?? "To be provided"}
                      </div>
                    )}
                  </div>

                  {/* Year & Section */}
                  <div className="md:text-xl font-light">
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
                          className="w-1/2 border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        />
                        <input
                          type="text"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="Section"
                          className="w-1/2 border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="md:text-2xl mt-1">
                        {profile.year_level && profile.section
                          ? `${profile.year_level}${profile.section}`
                          : "To be provided"}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Bio
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border font-medium border-gray-800 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                      />
                    ) : (
                      <div className="md:text-2xl mt-1">
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

        <DecorativeFooter />

        {/* Faculty Academic Info */}
        {isFaculty && <FacultyAcademicInfo profile={profile} />}

        {/* Student Password Change Section */}
        {!isFaculty && (
          <div className="md:mt-16 mt-12 md:w-1/2">
            <div className="mb-12">
              <h2 className="text-3xl uppercase md:text-4xl font-black tracking-tight  text-white mb-3">
                Change Password
              </h2>
              <p className="text-slate-400">
                Update your account password to keep your account secure
              </p>
            </div>
            <ChangePasswordForm />
          </div>
        )}

        <DecorativeFooter />

        {sessions && sessions.length > 0 && (
          <ManageAccessDevices sessions={sessions} />
        )}
      </main>
    </div>
  );
}
