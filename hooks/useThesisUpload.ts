"use client";

import { submitThesisForApproval } from "@/actions/thesisApproval";
import { Thesis } from "@/types/thesis";
import { useRouter } from "next/navigation";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { toast } from "sonner";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  file: File;
  id: string;
  status: "ready" | "uploading" | "completed";
}

export function useThesisUpload() {
  const router = useRouter();

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [cloudinaryId, setCloudinaryId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelPending, setIsCancelPending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Thesis, string>>>(
    {}
  );

  const [form, setForm] = useState<Thesis>({
    title: "",
    abstract: "",
    keywords: [],
    proponents: [],
    adviser_name: "",
    adviser_id: "",
    panel_chair_name: "",
    panel_members: [],
    defense_year: new Date().getFullYear(),
    category: [],
  });

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
    if (fileExtension !== ".pdf" || file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      toast.error("Please upload a PDF file not exceeding 5MB.");
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

  const handleSubmitThesis = async () => {
    if (!uploadedFile) return;

    setIsPending(true);

    const formData = new FormData();
    formData.append("file", uploadedFile.file);

    const res = await fetch("/api/upload-thesis", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      setCloudinaryUrl(data.url);
      setCloudinaryId(data.public_id);
      setModalOpen(true);
      document.body.classList.add("modal-open");
    } else {
      console.error("Upload failed");
    }

    setIsPending(false);
  };

  const handleSubmitMetadata = async (formData: Thesis) => {
    if (!cloudinaryUrl) return;

    setIsPending(true);

    const result = await submitThesisForApproval({
      ...formData,
      file_url: cloudinaryUrl,
      adviser_id: formData.adviser_id!,
    });

    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Thesis submitted successfully to ${formData.adviser_name}! Please wait for approval.`
      );
      router.push("/");
      setModalOpen(false);
      document.body.classList.remove("modal-open");
      removeFile();
    }
  };

  // UPLOAD THESIS MODAL

  const handleChange = <K extends keyof Thesis>(key: K, value: Thesis[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Thesis, string>> = {};

    // Define required fields manually
    const requiredFields: (keyof Thesis)[] = [
      "title",
      "abstract",
      "keywords",
      "proponents",
      "panel_chair_name",
      "panel_members",
      "defense_year",
      "category",
    ];

    requiredFields.forEach((key) => {
      const value = form[key];
      if (
        (Array.isArray(value) && value.length === 0) ||
        value === "" ||
        value === 0
      ) {
        newErrors[key] = "Required";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields!");
      return false;
    }

    return true;
  };

  const onClose = async () => {
    if (isCancelPending) return; // prevent double clicks
    setIsCancelPending(true);

    try {
      // If a file is uploaded but not submitted, delete it from Cloudinary
      if (cloudinaryId) {
        await fetch("/api/delete-thesis", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: cloudinaryId }),
        });
      }
    } catch (err) {
      console.error("Failed to delete Cloudinary file:", err);
    } finally {
      setCloudinaryId(null);
      setCloudinaryUrl(null);
      removeFile();
      setModalOpen(false);
      document.body.classList.remove("modal-open");
      setIsCancelPending(false);
    }
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
    modalOpen,
    handleSubmitThesis,
    handleSubmitMetadata,
    isPending,
    onClose,
    form,
    handleChange,
    errors,
    validate,
    isCancelPending,
  };
}
