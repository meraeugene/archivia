"use client";

import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Lightbulb,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { StudentData, StudentDataField } from "@/types/advisers";

const StudentAdviserMatcher = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<StudentData>({
    thesisTitle: "",
    abstract: "",
    availability: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<any | null>(null);

  const handleInputChange = (field: StudentDataField, value: string) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGetRecommendations = async () => {
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: studentData.thesisTitle,
          abstract: studentData.abstract,
        }),
      });

      const data = await res.json();
      console.log(data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleConnectClick = (adviser: any) => {
    setSelectedAdviser(adviser);
    setShowModal(true);
  };

  const cancelSendRequest = () => {
    setShowModal(false);
    setSelectedAdviser(null);
  };

  const confirmSendRequest = () => {
    console.log("Send request to adviser:", selectedAdviser);
    setShowModal(false);
  };

  return (
    <div className="flex max-w-6xl mx-auto px-5 bg-white text-black">
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
          </div>

          {/* Get Recommendations Button */}
          <button
            onClick={handleGetRecommendations}
            className="mt-6 w-full px-5 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition font-medium"
          >
            Get Recommendations
          </button>

          <div className="mt-8 p-4 border border-blue-100 bg-blue-50 rounded-lg text-sm text-gray-800 flex items-start gap-2">
            <Lightbulb className="text-blue-600 mt-0.5" size={18} />
            <p>
              When you click{" "}
              <span className="font-medium">Get Recommendations</span>, results
              from your FastAPI backend will appear on the right.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Adviser Recommendations */}
      <div className="w-3/5 flex flex-col p-8 pr-0">
        <h2 className="text-3xl font-bold mb-6">Recommended Advisers</h2>

        {recommendations.length === 0 ? (
          <p className="text-gray-600">No recommendations yet.</p>
        ) : (
          <div className="grid gap-6">
            {recommendations.map((adviser, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {adviser.adviser}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {adviser.projects.length} handled projects
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  Example of projects this adviser supervised:
                </p>

                <div className="space-y-2">
                  {adviser.projects.slice(0, 3).map((proj: any, i: number) => (
                    <div
                      key={i}
                      className="p-2 border rounded bg-gray-50 text-sm"
                    >
                      <h4 className="font-medium">{proj.title}</h4>
                      <p className="text-gray-600">
                        Similarity: {(proj.similarity * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleConnectClick(adviser)}
                  className="w-full mt-6 flex items-center justify-center gap-2 border border-gray-400 bg-black hover:bg-black/90 text-white cursor-pointer font-medium py-3 px-6 rounded-lg transition"
                >
                  <UserPlus size={18} />
                  Connect with {adviser.adviser}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="text-black" size={32} />
              <h3 className="text-xl font-semibold text-black">
                Confirm Leadership Role
              </h3>
            </div>

            <p className="text-gray-700 mb-3">
              You are about to send a formal adviser request to{" "}
              <span className="inline-block text-black font-medium">
                {selectedAdviser?.adviser}
              </span>
            </p>
            <p className="text-gray-700 mb-8">
              Confirm that you are the{" "}
              <span className="font-semibold text-black">
                official leader of your thesis group
              </span>
              . This is required to proceed with the request.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSendRequest}
                className="px-4 py-2 cursor-pointer rounded-lg border border-gray-200 bg-white text-black hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendRequest}
                className="px-5 py-2 cursor-pointer rounded-lg bg-black text-white font-medium hover:bg-black/90 transition"
              >
                Yes, I am the Leader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAdviserMatcher;
