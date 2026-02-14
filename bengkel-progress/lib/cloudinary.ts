export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bengkel-upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dvhno6zz5/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload gagal");
  }

  return data.secure_url as string;
}
