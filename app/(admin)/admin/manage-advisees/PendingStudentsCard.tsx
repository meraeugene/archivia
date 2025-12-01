/* eslint-disable @next/next/no-img-element */
"use client";

import { Advisee } from "@/types/adviserAdvisees";
import { FileText, User, Trash2 } from "lucide-react";
import { removePendingStudent } from "@/actions/admin/removePendingStudent";
import { toast } from "react-hot-toast";

interface PendingStudentsCardProps {
  pending: Advisee[];
  setSelectedStudent: (student: Advisee) => void;
  adviser_id: string; // pass adviser_id to remove
}

const PendingStudentsCard = ({
  pending,
  setSelectedStudent,
  adviser_id,
}: PendingStudentsCardProps) => {
  const handleRemovePending = async (student_id: string) => {
    try {
      await removePendingStudent(student_id, adviser_id);
      toast.success("Pending request removed successfully");
    } catch (error) {
      toast.error("Failed to remove pending request");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-3 text-yellow-500">
        Pending Requests
      </h3>
      <div className="space-y-3">
        {pending.map((student, index) => (
          <div
            key={student.student_id}
            className="group bg-white p-4 rounded-md shadow-xl hover:shadow-2xl hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer transition-all duration-200 flex justify-between items-start"
          >
            <div
              className="flex items-start gap-4 flex-1"
              onClick={() => {
                setSelectedStudent(student);
                document.body.classList.add("modal-open");
              }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {student.student_profile ? (
                    <img
                      src={student.student_profile}
                      alt={`${student.student_name}'s profile`}
                      className="h-6 w-6 rounded-full border"
                    />
                  ) : (
                    <User className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  )}
                  <h3 className="font-bold text-gray-900 text-base">
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

            {/* Remove Pending Button */}
            <button
              onClick={() => handleRemovePending(student.student_id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingStudentsCard;
