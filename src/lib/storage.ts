import { supabase } from "@/integrations/supabase/client";

const BUCKET = "portfolio";

export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(publicUrl: string): Promise<void> {
  const idx = publicUrl.indexOf(`/${BUCKET}/`);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + BUCKET.length + 2);
  await supabase.storage.from(BUCKET).remove([path]);
}

export function getFileTypeFromName(name: string): "pdf" | "docx" | "video" | "image" | "other" {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "other";
}
