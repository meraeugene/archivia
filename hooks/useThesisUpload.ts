"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  file: File;
  id: string;
  status: "ready" | "uploading" | "completed";
}

export function useThesisUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (fileExtension !== ".pdf") {
      setUploadStatus("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      return;
    }

    setUploadedFile({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: "ready",
    });
    setUploadStatus("success");
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    dragActive,
    uploadedFile,
    uploadStatus,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
  };
}
