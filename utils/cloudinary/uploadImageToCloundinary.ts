"use server";

export async function uploadImageToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary upload error:", data.error);
    }

    return {
      success: true,
      url: data.secure_url as string,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return { success: false, error: "Error uploading image" };
  }
}
