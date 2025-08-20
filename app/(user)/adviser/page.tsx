"use client";

import React, { useState, useMemo } from "react";
import { User, Clock, BookOpen, Tags, FileText } from "lucide-react";
import { mockAdvisers } from "@/data/advisers";

interface StudentData {
  thesisTitle: string;
  abstract: string;
  keywords: string;
  availability: string;
}

type StudentDataField = keyof StudentData;

const StudentAdviserMatcher = () => {
  // Student form state
  const [studentData, setStudentData] = useState<StudentData>({
    thesisTitle: "",
    abstract: "",
    keywords: "",
    availability: "",
  });

  // Filter advisers based on student input
  const filteredAdvisers = useMemo(() => {
    if (!studentData.keywords && !studentData.availability) {
      return mockAdvisers;
    }

    return mockAdvisers.filter((adviser) => {
      // Check if adviser specialization matches student interests
      const interestMatch =
        !studentData.keywords ||
        adviser.specialization.some(
          (spec) =>
            spec.toLowerCase().includes(studentData.keywords.toLowerCase()) ||
            studentData.keywords.toLowerCase().includes(spec.toLowerCase())
        );

      // Check if adviser availability matches student availability
      const availabilityMatch =
        !studentData.availability ||
        adviser.availability.some(
          (day) =>
            day
              .toLowerCase()
              .includes(studentData.availability.toLowerCase()) ||
            studentData.availability.toLowerCase().includes(day.toLowerCase())
        );

      return interestMatch && availabilityMatch;
    });
  }, [studentData]);

  const handleInputChange = (field: StudentDataField, value: string) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex  max-w-6xl mx-auto px-5 bg-white text-black ">
      {/* Left Panel - Student Input Form */}
      <div className="w-2/5 border-r border-gray-300 py-8 pr-8 sticky top-[65px] self-start h-screen">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Adviser</h1>

          <div className="space-y-6">
            {/* Thesis Title */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-3">
                <BookOpen className="mr-2" size={20} />
                Thesis Title
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black/80 outline-none"
                placeholder="e.g., Predictive Models for Crop Yield"
                value={studentData.thesisTitle}
                onChange={(e) =>
                  handleInputChange("thesisTitle", e.target.value)
                }
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-3">
                <FileText className="mr-2" size={20} />
                Abstract / Proposal Summary
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-1 focus:ring-black/80 outline-none"
                rows={6}
                placeholder="Summarize your research problem and objectives..."
                value={studentData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-3">
                <Tags className="mr-2" size={20} />
                Keywords
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black/80 outline-none"
                placeholder="e.g., Machine Learning, Climate Change, Data Mining"
                value={studentData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </div>

            {/* Availability Input */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-3">
                <Clock className="mr-2" size={20} />
                Availability
              </label>
              <input
                type="text"
                className="w-full p-3  border border-gray-300 rounded-lg  resize-none focus:ring-1 focus:ring-black/80 focus:border-transparent outline-none"
                placeholder="e.g., Monday, Wednesday, Friday..."
                value={studentData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50 ">
            <p className="text-sm text-gray-700">
              💡 Start typing your{" "}
              <span className="font-medium">
                abstract, keywords, or availability
              </span>{" "}
              to see matching advisers in real-time!
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Adviser Recommendations */}
      <div className="w-3/5 flex flex-col  p-8 pr-0">
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
          <h2 className="text-3xl font-bold">Advisers</h2>
          <span className="text-sm border px-3 py-1 rounded-md bg-black text-white">
            {filteredAdvisers.length}
          </span>
        </div>

        <div className="flex-1 ">
          {filteredAdvisers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">
                No advisers match your current criteria. Try adjusting your
                interests or availability.
              </p>
            </div>
          ) : (
            <div className="grid  gap-6">
              {filteredAdvisers.map((adviser) => (
                <div
                  key={adviser.id}
                  className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{adviser.name}</h3>
                      <span className="text-sm text-gray-600">
                        {adviser.students} students
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{adviser.bio}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Specializations:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {adviser.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 border border-gray-400 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Available:</h4>
                      <div className="flex flex-wrap gap-2">
                        {adviser.availability.map((day, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 border border-gray-400 rounded-full text-sm"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 border border-gray-400 bg-black hover:bg-black/90 text-white cursor-pointer font-medium py-3 px-6 rounded-lg transition">
                    Connect with {adviser.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAdviserMatcher;
