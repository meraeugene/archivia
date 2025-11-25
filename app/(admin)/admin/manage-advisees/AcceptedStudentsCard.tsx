/* eslint-disable @next/next/no-img-element */
"use client";

import { Advisee } from "@/types/adviserAdvisees";
import { FileText, User } from "lucide-react";

interface AcceptedStudentsCardProps {
  accepted: Advisee[];
  setSelectedStudent: (student: Advisee) => void;
}

const AcceptedStudentsCard = ({
  accepted,
  setSelectedStudent,
}: AcceptedStudentsCardProps) => {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-gray-900">
        Accepted Advisees
      </h3>
      <div className="space-y-3">
        {accepted.map((student, index) => (
          <div
            key={student.student_id}
            className="group bg-white p-4 rounded-md shadow-xl border border-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer hover:shadow-2xl transition-all duration-200"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {student.student_profile ? (
                    <img
                      src={student.student_profile}
                      alt={`${student.student_name}'s profile`}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                  <h3 className="font-bold text-black text-base">
                    {student.student_name}
                  </h3>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {student.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedStudentsCard;
