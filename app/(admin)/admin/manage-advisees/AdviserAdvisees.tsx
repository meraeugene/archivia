/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { SetLimitModal } from "./SetLimitModal";
import { Button } from "@/components/ui/button"; // optional, or use any button
import { AdviserWithAdvisees } from "@/types/adviserAdvisees";
import { FileText, Users } from "lucide-react";
import { getInitials } from "@/utils/getInitials";

const AdviserAdvisees = ({ data }: { data: AdviserWithAdvisees[] }) => {
  const [selectedAdviser, setSelectedAdviser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        {data.map((adviser) => (
          <div
            key={adviser.adviser_id}
            className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-gray-100 rounded-lg rounded-br-none rounded-bl-none px-6 py-5 flex items-center justify-between">
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

              <div className="flex items-center gap-2  ">
                <Users className="h-4 w-4 text-black" />
                <span className="text-lg font-bold text-black">
                  {adviser.total_advisees}
                  {adviser.max_limit && adviser.max_limit > 0
                    ? ` / ${adviser.max_limit}`
                    : ""}
                </span>

                <span className="text-xs text-gray-600 uppercase tracking-wider">
                  advisees
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {adviser.advisees?.length ? (
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded mb-6 bg-black text-white hover:bg-gray-700 hover:text-white"
                    onClick={() => {
                      setSelectedAdviser(adviser.adviser_id);
                      setIsModalOpen(true);
                    }}
                  >
                    Set Limit
                  </Button>
                  <div className="space-y-3 ">
                    {adviser.advisees.map((student, index) => (
                      <div
                        key={student.student_id}
                        className="group bg-white p-4  rounded-md shadow-xl border border-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer hover:shadow-2xl transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-black flex-shrink-0" />
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
              ) : (
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded bg-black text-white hover:bg-gray-700 hover:text-white"
                    onClick={() => {
                      setSelectedAdviser(adviser.adviser_id);
                      setIsModalOpen(true);
                    }}
                  >
                    Set Limit
                  </Button>

                  <div className="flex mt-6  flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-md">
                    <Users className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-extrabold">
                      No advisees assigned yet
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Set Limit Modal */}
      {selectedAdviser && (
        <SetLimitModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
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
