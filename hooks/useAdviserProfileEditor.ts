"use client";

import { useState, ChangeEvent, useTransition } from "react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/utils/cloudinary/uploadImageToCloundinary";
import { updateAdviserProfile } from "@/actions/faculty/updateAdviserProfile";
import { CurrentUser } from "@/types/currentUser";

type AdviserFormState = {
  prefix: string;
  full_name: string;
  suffix: string;
  email: string;
  bio: string;
  position: string;
  highest_educational_attainment: string;
  research_interest: string;
  handled_subjects: string;
  profile_picture: string | File;
};

interface SyntheticInputEvent {
  target: {
    name: string;
    value: string;
  };
}

export function useAdviserProfileEditor(profile: CurrentUser) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string>(
    profile.profile_picture ?? ""
  );

  const [formData, setFormData] = useState<AdviserFormState>({
    prefix: profile.prefix ?? "",
    full_name: profile.full_name ?? "",
    suffix: profile.suffix ?? "",
    email: profile.email ?? "",
    bio: profile.bio ?? "",
    position: profile.position ?? "",
    highest_educational_attainment:
      profile.highest_educational_attainment ?? "",
    research_interest: profile.research_interest ?? "",
    handled_subjects: profile.handled_subjects ?? "",
    profile_picture: profile.profile_picture ?? "",
  });

  // Handle input & textarea changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SyntheticInputEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection (preview only)
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

  // Remove profile picture
  const handleRemovePicture = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, profile_picture: "" }));
    toast.info("Profile picture removed. Click Save to confirm.");
  };

  // Save all changes (upload + update)
  const handleSave = () => {
    startTransition(async () => {
      setIsUploading(true);
      try {
        let imageUrl = profile.profile_picture ?? "";

        // Upload new file if user selected one
        if (formData.profile_picture instanceof File) {
          toast.loading("Uploading image...");
          const uploadResult = await uploadImageToCloudinary(
            formData.profile_picture
          );

          if (!uploadResult.success) {
            console.log(uploadResult.error || "Upload failed");
          }

          imageUrl = uploadResult.url ?? "";
        } else if (formData.profile_picture === "") {
          // Removed image
          imageUrl = "";
        }

        // Update adviser profile
        const result = await updateAdviserProfile({
          ...formData,
          profile_picture: imageUrl,
        });

        if (result?.error) console.log(result.error);

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) console.log(err.message);
        else console.log("Something went wrong while saving.");
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      prefix: profile.prefix ?? "",
      full_name: profile.full_name ?? "",
      suffix: profile.suffix ?? "",
      email: profile.email ?? "",
      bio: profile.bio ?? "",
      position: profile.position ?? "",
      highest_educational_attainment:
        profile.highest_educational_attainment ?? "",
      research_interest: profile.research_interest ?? "",
      handled_subjects: profile.handled_subjects ?? "",
      profile_picture: profile.profile_picture ?? "",
    });

    setImagePreview(profile.profile_picture ?? "");
    toast.info("Changes reverted.");
  };

  return {
    formData,
    setFormData,
    imagePreview,
    isEditing,
    setIsEditing,
    isUploading,
    pending,
    handleChange,
    handleFileSelect,
    handleRemovePicture,
    handleSave,
    handleCancel,
  };
}
