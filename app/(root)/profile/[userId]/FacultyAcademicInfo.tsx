"use client";
import { CurrentUser } from "@/types/currentUser";
import { GraduationCap, FileText, BookOpen, Award } from "lucide-react";
const FacultyAcademicInfo = ({ profile }: { profile: CurrentUser }) => {
  return (
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
  );
};

export default FacultyAcademicInfo;
