"use client";

import { useThesisUpload } from "@/hooks/useThesisUpload";
import { Upload, X, Check, FileText, CheckCircle } from "lucide-react";
import UploadThesisModal from "./UploadThesisModal";

const ThesisUploadUI: React.FC = () => {
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
  } = useThesisUpload();

  return (
    <main className="flex-1 mx-auto  bg-gray-50 text-black py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Thesis Upload</h1>
        <p className="text-gray-600 text-lg">
          Upload your thesis document (PDF only, max 10MB)
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-1 max-w-4xl bg-white mx-auto rounded-sm border-dashed transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : uploadedFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-16 text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              dragActive
                ? "bg-blue-100"
                : uploadedFile
                ? "bg-green-100"
                : "bg-white border border-gray-100"
            }`}
          >
            {uploadedFile ? (
              <Check className="text-green-600" size={32} />
            ) : (
              <Upload
                className={`${dragActive ? "text-blue-600" : "text-gray-600"}`}
                size={24}
              />
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {dragActive
              ? "Drop your thesis here"
              : uploadedFile
              ? uploadedFile.file.name
              : "Click or drag your thesis PDF"}
          </h3>
          <p className="text-gray-500">
            Only PDF format is supported (max 10MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileInput}
          />
        </div>
      </div>

      {/* File Display */}
      {uploadedFile && (
        <div className="space-y-4 mb-8 mt-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="text-blue-600" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {uploadedFile.file.name}
                  </h3>
                  <p className="text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {uploadedFile && uploadStatus === "success" && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmitThesis}
            disabled={isPending}
            className={`flex items-center gap-2 px-8 py-3 bg-black hover:bg-black/90  text-white font-medium transition-colors duration-200 rounded ${
              isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {isPending ? "Uploading..." : "Upload Thesis"}
          </button>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="flex justify-center mt-12">
        <div className="bg-white shadow-xs p-8 rounded-lg max-w-4xl w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Thesis Upload Guidelines
          </h3>

          <div className="flex flex-col md:flex-row justify-between text-sm text-gray-700 gap-6">
            {/* File Requirements */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                File Requirements
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Accepted format: <span className="font-medium">PDF only</span>
                </li>
                <li>
                  Maximum file size: <span className="font-medium">10MB</span>
                </li>
                <li>Only one file can be uploaded</li>
              </ul>
            </div>

            {/* Submission Guidelines */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Submission Guidelines
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Ensure the thesis is the{" "}
                  <span className="font-medium">final approved version</span>
                </li>
                <li>Include all necessary sections and appendices</li>
                <li>Check formatting and content before uploading</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <UploadThesisModal
        isOpen={modalOpen}
        onClose={onClose}
        onSubmit={handleSubmitMetadata}
        isPending={isPending}
      />
    </main>
  );
};

export default ThesisUploadUI;
