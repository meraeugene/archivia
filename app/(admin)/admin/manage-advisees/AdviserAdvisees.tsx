/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { SetLimitModal } from "./SetLimitModal";
import { Button } from "@/components/ui/button";
import { AdviserWithAdvisees, Advisee } from "@/types/adviserAdvisees";
import { Users, UserPlus, Search } from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { Input } from "@/components/ui/input";
import StudentInfoModal from "./StudentInfoModal";
import NoAdviseeCard from "./NoAdviseeCard";
import AcceptedStudentsCard from "./AcceptedStudentsCard";
import PendingStudentsCard from "./PendingStudentsCard";
import { removeAllAdviseesFromAdviser } from "@/actions/admin/removeAllAdviseesFromAdviser";
import { toast } from "sonner";
import { ConfirmModal } from "./ConfirmModal";

const AdviserAdvisees = ({ data }: { data: AdviserWithAdvisees[] }) => {
  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Advisee | null>(null);

  const filteredData = data.filter((adviser) =>
    adviser.adviser_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Input */}
      <div className="mb-6 relative md:w-[300px] w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by adviser..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-9 rounded border focus:ring-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2  2xl:grid-cols-2  gap-8">
        {filteredData.map((adviser) => {
          const accepted =
            adviser.advisees?.filter((a) => a.status === "accepted") || [];
          const pending =
            adviser.advisees?.filter(
              (a) => a.status === "pending" || a.status === "referred"
            ) || [];

          return (
            <div
              key={adviser.adviser_id}
              className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 h-fit"
            >
              {/* Header */}
              <div className="bg-gray-100 rounded-t-lg px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    {adviser.profile_picture ? (
                      <img
                        src={adviser.profile_picture}
                        alt={adviser.adviser_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-black font-bold">
                        {getInitials(adviser.adviser_name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900 leading-tight ">
                      {adviser.adviser_name}
                    </h2>
                    <p className="text-sm text-gray-800">Academic Adviser</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-black" />
                  <span className="text-lg font-bold text-black">
                    {" "}
                    {adviser.total_accepted}{" "}
                    {adviser.max_limit && adviser.max_limit > 0
                      ? ` / ${adviser.max_limit}`
                      : ""}{" "}
                  </span>

                  <span className="text-xs text-gray-600 uppercase tracking-wider">
                    advisees
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded  hover:bg-gray-50 hover:text-black flex items-center gap-2"
                    onClick={() => {
                      setSelectedAdviser(adviser.adviser_id);
                      setIsLimitModalOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 " />
                    Set Limit
                  </Button>

                  {adviser.total_accepted > 0 && (
                    <ConfirmModal
                      mainText="Remove All Advisees"
                      title="Remove All Advisees?"
                      description="This action will remove all advisees from this adviser. This cannot be undone."
                      confirmText="Confirm"
                      cancelText="Cancel"
                      onConfirm={async () => {
                        await removeAllAdviseesFromAdviser(adviser.adviser_id);
                        toast.success("All advisees removed.");
                      }}
                    />
                  )}
                </div>

                <div className="space-y-6">
                  {/* Pending Requests */}
                  {pending.length > 0 && (
                    <PendingStudentsCard
                      pending={pending}
                      setSelectedStudent={setSelectedStudent}
                    />
                  )}

                  {/* Accepted Advisees */}
                  {accepted.length > 0 && (
                    <AcceptedStudentsCard
                      accepted={accepted}
                      setSelectedStudent={(student) => {
                        setSelectedStudent(student);
                      }}
                      adviserId={adviser.adviser_id}
                    />
                  )}

                  {/* No Advisees Fallback */}
                  {adviser.total_advisees === 0 && <NoAdviseeCard />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Info Modal */}
      {selectedStudent && (
        <StudentInfoModal
          selectedStudent={selectedStudent}
          setSelectedStudent={(student) => {
            setSelectedStudent(student);
          }}
        />
      )}

      {/* Set Limit Modal */}
      {selectedAdviser && (
        <SetLimitModal
          isOpen={isLimitModalOpen}
          setIsOpen={setIsLimitModalOpen}
          adviser_id={selectedAdviser}
          currentLimit={
            data.find((a) => a.adviser_id === selectedAdviser)?.max_limit || 0
          }
        />
      )}
    </>
  );
};

export default AdviserAdvisees;
