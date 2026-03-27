"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase (Pakai Service Role agar bypass RLS saat upload)
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
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Gagal Upload ke Storage: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("warta")
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * 1. TAMBAH ARTIKEL (CREATE)
 */
export async function createInfo(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const manualSlug = formData.get("slug") as string; // ✅ Ambil slug dari UI
  
  if (!title || !content || !category_id) {
    throw new Error("Judul, Konten, dan Kategori wajib diisi!");
  }

  const file = formData.get("thumbnailFile") as File;
  let imageUrl = null;

  try {
    if (file && file.size > 0) {
      imageUrl = await uploadToSupabase(file, "thumbnails");
    }

    // Gunakan slug dari UI, jika kosong baru generate manual
    const finalSlug = manualSlug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    await prisma.info.create({
      data: {
        title,
        slug: finalSlug,
        content,
        thumbnail: imageUrl,
        status: status || "publish",
        category_id: category_id || null,
        is_active: true
      },
    });
  } catch (error: any) {
    console.error("CREATE ERROR:", error);
    if (error.code === 'P2002') throw new Error("URL/Slug sudah terpakai, ganti judul dikit!");
    throw new Error(error.message || "Gagal menyimpan ke database");
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  redirect("/admin/info");
}

/**
 * 2. UPDATE ARTIKEL (EDIT)
 */
export async function updateInfo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string; // ✅ Ambil slug terbaru dari UI
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const oldThumbnail = formData.get("oldThumbnail") as string;

  if (!id) throw new Error("ID tidak ditemukan");

  const file = formData.get("thumbnailFile") as File;
  let finalImageUrl = oldThumbnail;

  try {
    // Jika ada upload file baru
    if (file && file.size > 0) {
      const uploadedUrl = await uploadToSupabase(file, "thumbnails");
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    await prisma.info.update({
      where: { id },
      data: {
        title,
        slug, // ✅ Pastikan slug juga diupdate
        content,
        thumbnail: finalImageUrl,
        status: status || "publish",
        category_id: category_id || null,
        updated_at: new Date(),
      },
    });
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    if (error.code === 'P2002') throw new Error("Gagal! URL/Slug ini sudah dipakai berita lain.");
    throw new Error(error.message || "Koneksi Database/Storage Bermasalah");
  }

  revalidatePath("/admin/info");
  revalidatePath(`/warta/${slug}`);
  revalidatePath("/");
  redirect("/admin/info");
}

/**
 * 3. HAPUS ARTIKEL (DELETE)
 */
export async function deleteInfo(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.info.delete({
      where: { id },
    });
    revalidatePath("/admin/info");
    revalidatePath("/warta");
  } catch (error) {
    console.error("DELETE ERROR:", error);
    throw new Error("Gagal menghapus data.");
  }
}