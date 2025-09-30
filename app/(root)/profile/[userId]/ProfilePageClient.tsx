"use client";

import { useState } from "react";
import { CurrentUser } from "@/types/currentUser";
import { getInitials } from "@/utils/getInitials";
import {
  Mail,
  BookOpen,
  GraduationCap,
  Award,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { updateStudentProfile } from "@/actions/profile";
import { toast } from "sonner";

export default function ProfilePageClient({
  profile,
}: {
  profile: CurrentUser;
}) {
  const router = useRouter();
  const isFaculty = profile.role === "faculty";

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: profile.email ?? "",
    course: profile.course ?? "To be provided",
    year_level: profile.year_level ?? 0,
    section: profile.section ?? "",
    bio: profile.bio ?? "To be provided",
  });

  const handleEditProfileClick = () => {
    if (isFaculty) {
      router.push(`/settings`);
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateStudentProfile(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while saving your profile.");
    }
  };

  return (
    <div className="bg-white">
      <main className="max-w-6xl mx-auto px-5 py-16">
        {/* Profile Header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="relative">
              {profile.profile_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_picture}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-[340px] flex items-center justify-center text-white bg-black font-bold text-8xl tracking-tighter">
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>

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
                {profile.full_name}
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
                {/* Cancel Button */}
                <button
                  onClick={() => setIsEditing(false)}
                  className="group cursor-pointer relative px-12 py-5  text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 w-full sm:w-auto border"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-white">
                    Cancel
                    <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                  </span>
                  <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="group cursor-pointer relative px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 w-full sm:w-auto border"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-white">
                    Save
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                  <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditProfileClick}
                className="group cursor-pointer relative px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 w-full sm:w-auto border"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-white">
                  Edit Profile
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
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
        {isFaculty && (
          <div className="pt-16">
            <h2 className="text-4xl font-black mb-12 tracking-tight">
              ACADEMIC PROFILE
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {profile.highest_educational_attainment && (
                <div className="group cursor-pointer">
                  <div className="border border-black p-8 h-full transition-all duration-300 hover:bg-black hover:text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <GraduationCap className="w-6 h-6" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">
                        Education
                      </h3>
                    </div>
                    <p className="text-lg font-light leading-relaxed">
                      {profile.highest_educational_attainment}
                    </p>
                  </div>
                </div>
              )}

              {profile.research_interest && (
                <div className="group cursor-pointer">
                  <div className="border border-black p-8 h-full transition-all duration-300 hover:bg-black hover:text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">
                        Research Interest
                      </h3>
                    </div>
                    <p className="text-lg font-light leading-relaxed">
                      {profile.research_interest}
                    </p>
                  </div>
                </div>
              )}

              {profile.handled_subjects && (
                <div className="group cursor-pointer">
                  <div className="border border-black p-8 h-full transition-all duration-300 hover:bg-black hover:text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="w-6 h-6" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">
                        Subjects Taught
                      </h3>
                    </div>
                    <p className="text-lg font-light leading-relaxed">
                      {profile.handled_subjects}
                    </p>
                  </div>
                </div>
              )}

              {profile.orcid && (
                <div className="group cursor-pointer">
                  <div className="border border-black p-8 h-full transition-all duration-300 hover:bg-black hover:text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">
                        ORCID
                      </h3>
                    </div>
                    <a
                      href={`https://orcid.org/${profile.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-mono underline hover:no-underline"
                    >
                      {profile.orcid}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
