"use client";

import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/utils/cloudinary/uploadImageToCloundinary";
import { CurrentUser } from "@/types/currentUser";
import { updateStudentProfile } from "@/actions/student/updateStudentProfile";

type FormDataState = {
  email: string;
  course: string;
  year_level: number;
  section: string;
  bio: string;
  profile_picture: string | File;
};

export function useProfileEditor(profile: CurrentUser) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    profile.profile_picture ?? ""
  );

  const [formData, setFormData] = useState<FormDataState>({
    email: profile.email ?? "",
    course: profile.course ?? "To be provided",
    year_level: profile.year_level ?? 0,
    section: profile.section ?? "",
    bio: profile.bio ?? "To be provided",
    profile_picture: profile.profile_picture ?? "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 1;
    if (file.size / (1024 * 1024) > MAX_SIZE_MB) {
      toast.error(`File too large! Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
    setFormData((prev) => ({ ...prev, profile_picture: file }));
  };

  const handleRemovePicture = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, profile_picture: "" }));
    toast.info("Profile picture removed. Click Save to confirm.");
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let profilePictureUrl = profile.profile_picture ?? "";

      // if new image selected
      if (formData.profile_picture instanceof File) {
        const uploadResult = await uploadImageToCloudinary(
          formData.profile_picture
        );
        if (!uploadResult.success)
          console.log(uploadResult.error || "Upload failed");
        profilePictureUrl = uploadResult.url ?? "";
      }
      // if removed
      else if (formData.profile_picture === "") {
        profilePictureUrl = "";
      }

      const result = await updateStudentProfile({
        ...formData,
        profile_picture: profilePictureUrl,
      });

      if (result?.error) console.log(result.error);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong while saving.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formData,
    setFormData,
    imagePreview,
    isEditing,
    setIsEditing,
    isUploading,
    handleChange,
    handleFileSelect,
    handleRemovePicture,
    handleSave,
  };
}
