/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Mail,
  User,
  X,
} from "lucide-react";
import { Advisee } from "@/types/adviserAdvisees";
import { formatStudentYear } from "@/utils/formatStudentYear";
import { formatDate } from "@/utils/formatDate";
import { ConfirmModal } from "./ConfirmModal";
import { removeStudentFromAdviser } from "@/actions/admin/removeStudentFromAdviser";
import { toast } from "sonner";

interface StudentInfoProps {
  selectedStudent: Advisee;
  setSelectedStudent: (student: Advisee | null) => void;
  adviserId: string | null;
}

const StudentInfoModal = ({
  selectedStudent,
  setSelectedStudent,
  adviserId,
}: StudentInfoProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => {
        setSelectedStudent(null);
        document.body.classList.remove("modal-open");
      }}
    >
      <div
        className="bg-white animate-fadeInScale rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0shadow-lg">
            {selectedStudent.student_profile ? (
              <img
                src={selectedStudent.student_profile}
                alt={selectedStudent.student_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">
              {selectedStudent.student_name}
            </h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="bg-white/20 px-2 py-0.5 rounded">
                {selectedStudent.student_section || "No Section"}
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded">
                {formatStudentYear(selectedStudent.student_year)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedStudent(null);
              document.body.classList.remove("modal-open");
            }}
            className="absolute cursor-pointer top-4 right-4 p-1 rounded-full hover:bg-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between ">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                selectedStudent.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : selectedStudent.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {selectedStudent.status}
            </span>

            {selectedStudent && (
              <ConfirmModal
                mainText="Remove Student"
                title="Remove Student from Adviser?"
                description={`Are you sure you want to remove ${selectedStudent.student_name} from their adviser? This action cannot be undone.`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={async () => {
                  await removeStudentFromAdviser(
                    selectedStudent.student_id,
                    adviserId as string
                  );
                  toast.success("Student removed from adviser.");
                  setSelectedStudent(null);
                }}
              />
            )}
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Email
              </p>
              <p className="text-sm text-gray-900">
                {selectedStudent.student_email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Submitted
              </p>
              <p className="text-sm text-gray-900">
                {formatDate(selectedStudent.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Thesis Title
              </p>
              <p className="text-sm text-gray-900 font-medium leading-relaxed">
                {selectedStudent.title}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Abstract
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedStudent.abstract}
              </p>
            </div>
          </div>

          {selectedStudent.thesis_url && (
            <div className="pt-2">
              <a
                href={selectedStudent.thesis_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View Thesis Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInfoModal;
