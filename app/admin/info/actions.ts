"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase untuk Upload File
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * HELPER: Fungsi untuk Upload ke Supabase Storage
 */
async function uploadToSupabase(file: File, folder: string) {
  if (!file || file.size === 0) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("warta") // ✅ Pastikan nama BUCKET di Supabase adalah 'warta'
    .upload(filePath, file);

  if (error) {
    console.error("Gagal Upload ke Supabase:", error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("warta")
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * 1. TAMBAH ARTIKEL
 */
export async function createInfo(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  
  // Ambil File dari input 'thumbnailFile'
  const file = formData.get("thumbnailFile") as File;
  const imageUrl = await uploadToSupabase(file, "thumbnails");

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    await prisma.info.create({
      data: {
        title,
        slug,
        content,
        thumbnail: imageUrl, // Simpan URL hasil upload
        status: status || "publish",
        category_id: category_id || null,
      },
    });
  } catch (error) {
    console.error("Gagal membuat artikel:", error);
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  redirect("/admin/info");
}

/**
 * 2. UPDATE ARTIKEL
 */
export async function updateInfo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const oldThumbnail = formData.get("oldThumbnail") as string;

  if (!id) throw new Error("ID tidak ditemukan");

  // Logika Gambar: Jika ada file baru, upload. Jika tidak, pakai yang lama.
  const file = formData.get("thumbnailFile") as File;
  let finalImageUrl = oldThumbnail;

  if (file && file.size > 0) {
    const uploadedUrl = await uploadToSupabase(file, "thumbnails");
    if (uploadedUrl) finalImageUrl = uploadedUrl;
  }

  try {
    await prisma.info.update({
      where: { id },
      data: {
        title,
        content,
        thumbnail: finalImageUrl,
        status: status || "publish",
        category_id: category_id || null,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Gagal update artikel:", error);
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  redirect("/admin/info");
}

/**
 * 3. HAPUS ARTIKEL
 */
export async function deleteInfo(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.info.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Gagal hapus artikel:", error);
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
}