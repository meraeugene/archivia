"use client";

import { getInitials } from "@/utils/getInitials";
import {
  Mail,
  BookOpen,
  GraduationCap,
  Award,
  FileText,
  ArrowRight,
} from "lucide-react";

interface Profile {
  role: "student" | "faculty" | "admin";
  email: string;
  full_name: string;
  prefix?: string | null;
  suffix?: string | null;
  profile_picture?: string | null;
  position?: string | null;
  bio?: string | null;
  highest_educational_attainment?: string | null;
  research_interest?: string | null;
  orcid?: string | null;
  handled_subjects?: string | null;
  course?: string | null;
  year_level?: number | null;
  section?: string | null;
}

export default function ProfilePageClient({ profile }: { profile: Profile }) {
  const isFaculty = profile.role === "faculty";

  return (
    <div className="bg-white ">
      <main className="max-w-6xl mx-auto px-5 py-16">
        {/* Profile Header - Editorial Style */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="relative ">
              {profile.profile_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_picture}
                  alt={profile.full_name}
                  className="w-full h-full object-cover  "
                />
              ) : (
                <div className="w-full h-[340px] flex items-center justify-center text-white bg-black font-bold text-8xl tracking-tighter">
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>

            {/* Quick Contact */}
            {profile.email && (
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
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2">
            {/* Name & Title */}
            <div className="mb-8">
              <div className=" mb-4">
                <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-none">
                  {profile.prefix && (
                    <span className="text-3xl font-normal block mb-2">
                      {profile.prefix}
                    </span>
                  )}
                  {profile.full_name}
                  {profile.suffix && (
                    <span className="text-2xl font-light">
                      , {profile.suffix}
                    </span>
                  )}
                </h1>
              </div>

              {isFaculty && profile.position && (
                <p className="text-2xl tracking-wide uppercase font-light border-l-4 border-black pl-6 ml-6">
                  {profile.position}
                </p>
              )}

              {!isFaculty && (
                <div className="space-y-2">
                  <div className="text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Course
                    </span>
                    <div className="text-2xl mt-1">
                      {profile.course ?? "To be provided"}
                    </div>
                  </div>
                  <div className="text-xl font-light">
                    <span className="font-bold uppercase text-sm tracking-wider">
                      Year & Section
                    </span>
                    <div className="text-2xl mt-1">
                      {profile.year_level && profile.section
                        ? `Year ${profile.year_level} - Section ${profile.section}`
                        : "To be provided"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute -left-12 top-0 text-8xl font-black text-gray-200"></div>
                  <p className="text-lg leading-relaxed font-light relative z-10">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            <button className="group cursor-pointer relative px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300  w-full sm:w-auto border ">
              <span className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-white">
                Edit Profile
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-black"></div>
          <div className="w-2 h-2 bg-black rotate-45"></div>
          <div className="flex-1 h-px bg-black"></div>
        </div>

        {/* Academic Information - Masonry Style */}
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
