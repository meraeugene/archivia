"use client";

import { useThesisUpload } from "@/hooks/useThesisUpload";
import {
  Upload,
  X,
  Check,
  FileText,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import UploadThesisModal from "./UploadThesisModal";
import { StudentAdviser } from "@/types/studentAdviser";
import { useEffect, useState } from "react";

interface UploadThesisClientProps {
  categories: { key: string; label: string }[];
  studentAdviser: StudentAdviser;
}

const UploadThesisClient = ({
  categories,
  studentAdviser,
}: UploadThesisClientProps) => {
  const {
    dragActive,
    uploadedFile,
    uploadStatus,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    modalOpen,
    handleSubmitThesis,
    handleSubmitMetadata,
    isPending,
    onClose,
    isCancelPending,
  } = useThesisUpload();

  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative flex-1 mx-auto min-h-screen bg-black text-white py-20 px-6 md:px-8 overflow-hidden">
      {/* Apple-style animated mesh gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gray-400 rounded-full blur-[100px] animate-pulse"
          style={{
            transform: `translate(${-cursorPos.x * 0.015}px, ${
              -cursorPos.y * 0.015
            }px)`,
            transition: "transform 0.3s ease-out",
            animationDelay: "1s",
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div
        className={`relative max-w-6xl mx-auto transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header with Apple-style animation */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
              Academic Excellence
            </span>
          </div>

          <h1
            className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight transition-all duration-1000 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ lineHeight: "1.1" }}
          >
            Publish Your Thesis
          </h1>

          <p
            className={`text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-light transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Share your research with the world
          </p>

          <div
            className={`mt-10 flex items-center justify-center gap-8 md:gap-12 text-sm text-gray-500 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
              <span className="group-hover:text-white transition-colors duration-300">
                PDF Format
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
              <span className="group-hover:text-white transition-colors duration-300">
                Max 5MB
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
              <span className="group-hover:text-white transition-colors duration-300">
                Secure
              </span>
            </div>
          </div>
        </div>

        {/* Upload Zone - Apple Card Style */}
        <div
          className={`relative group max-w-4xl mx-auto mb-10 transition-all duration-700 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${dragActive ? "scale-105" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Glow effect on hover */}
          <div
            className={`absolute inset-0 bg-white rounded-[32px] blur-xl transition-opacity duration-500 ${
              dragActive || uploadedFile
                ? "opacity-20"
                : "opacity-0 group-hover:opacity-10"
            }`}
          ></div>

          <div
            className={`relative backdrop-blur-2xl border rounded-[32px] transition-all duration-500 cursor-pointer overflow-hidden ${
              dragActive
                ? "border-white/40 bg-white/20 shadow-2xl shadow-white/20"
                : uploadedFile
                ? "border-white/30 bg-white/10 shadow-2xl shadow-white/10"
                : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:shadow-xl hover:shadow-white/5"
            }`}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1500ms]"></div>
            </div>

            <div className="relative md:p-24 p-12 text-center">
              {/* Animated icon container */}
              <div className="relative inline-block mb-10">
                <div
                  className={`w-28 h-28 md:w-32 md:h-32 rounded-[24px] flex items-center justify-center transition-all duration-700 ${
                    dragActive || uploadedFile
                      ? "bg-white text-black scale-110 rotate-6 shadow-2xl shadow-white/30"
                      : "bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-3"
                  }`}
                >
                  {uploadedFile ? (
                    <Check
                      className="animate-in zoom-in duration-500"
                      size={48}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Upload
                      className={`transition-all duration-500 ${
                        dragActive
                          ? "scale-110 -translate-y-2"
                          : "group-hover:scale-110 group-hover:-translate-y-2"
                      }`}
                      size={40}
                      strokeWidth={2}
                    />
                  )}
                </div>

                {/* Floating particles effect */}
                {(dragActive || uploadedFile) && (
                  <>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    <div
                      className="absolute bottom-0 left-0 w-2 h-2 bg-white/60 rounded-full animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="absolute top-1/2 right-0 w-2 h-2 bg-white/40 rounded-full animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </>
                )}
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-300">
                {dragActive
                  ? "Drop to Upload"
                  : uploadedFile
                  ? "Ready to Publish"
                  : "Upload Document"}
              </h3>

              {uploadedFile ? (
                <p className="text-gray-300 text-lg font-medium animate-in fade-in duration-500">
                  {uploadedFile.file.name}
                </p>
              ) : (
                <p className="text-gray-400 text-lg transition-colors duration-300 group-hover:text-gray-300">
                  Click to browse or drag and drop your PDF
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInput}
              />
            </div>

            {/* Bottom progress bar */}
            <div
              className={`h-1.5 bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-700 ${
                uploadedFile ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            ></div>
          </div>
        </div>

        {/* File Display Card - Glass morphism */}
        {uploadedFile && (
          <div className="max-w-4xl mx-auto mb-10 animate-in slide-in-from-bottom duration-700 fade-in">
            <div className="relative group/card backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-4 md:p-7 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-0 group-hover/card:opacity-5 transition-opacity duration-500"></div>

              <div className="relative flex items-center  justify-between gap-6">
                <div className="flex items-center  gap-5 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10  md:w-16md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                      <FileText
                        className="text-black"
                        size={28}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center animate-pulse">
                      <Check className="text-black" size={12} strokeWidth={3} />
                    </div>
                  </div>

                  <div className="flex-1  min-w-0">
                    <h3 className="text-xl font-bold text-white truncate mb-1">
                      {uploadedFile.file.name}
                    </h3>
                    <div className="flex items-center gap-3  text-sm text-gray-400">
                      <span className="font-medium">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="flex-shrink-0 p-1.5 md:p-3.5 cursor-pointer text-black bg-white rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-xl focus:outline-none active:scale-95"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Apple style CTA */}
        {uploadedFile && uploadStatus === "success" && (
          <div className="flex justify-center  animate-in slide-in-from-bottom duration-1000 fade-in delay-200">
            <button
              onClick={handleSubmitThesis}
              disabled={isPending}
              className={`group/btn relative cursor-pointer px-16 py-3 md:py-6 bg-white text-black font-bold text-xl w-full rounded-full transition-all duration-500 overflow-hidden ${
                isPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-2xl hover:shadow-white/30 active:scale-95 shadow-xl shadow-white/20"
              }`}
            >
              {/* Animated gradient background on hover */}
              {!isPending && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              )}

              {/* Shimmer effect */}
              {!isPending && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
              )}

              <span className="relative flex items-center justify-center gap-4">
                {isPending ? (
                  <>
                    <div className="h-7 w-7 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle
                      className="w-7 h-7 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-500"
                      strokeWidth={2.5}
                    />
                    <span>Publish Thesis</span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      <UploadThesisModal
        isOpen={modalOpen}
        onClose={onClose}
        onSubmit={handleSubmitMetadata}
        isPending={isPending}
        categories={categories}
        studentAdviser={studentAdviser}
        isCancelPending={isCancelPending}
      />
    </main>
  );
};

export default UploadThesisClient;
