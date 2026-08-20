const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

export async function uploadImageToCloudinary(file) {
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    throw new Error("업로드할 이미지 파일을 선택해주세요.");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary 업로드 설정을 확인해주세요.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  let response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUD_NAME)}/image/upload`,
      { method: "POST", body: formData }
    );
  } catch {
    throw new Error("이미지 업로드 서버에 연결할 수 없습니다.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("이미지 업로드 응답을 확인할 수 없습니다.");
  }

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "이미지 업로드에 실패했습니다.");
  }

  return data.secure_url;
}
