"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase (Service Role untuk bypass RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * HELPER: Upload ke Supabase Storage
 */
async function uploadToSupabase(file: File, folder: string) {
  if (!file || file.size === 0) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("warta") 
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw new Error(`Storage Error: ${error.message}`);

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
  const manualSlug = formData.get("slug") as string;
  const file = formData.get("thumbnailFile") as File;

  let imageUrl = null;

  // Validasi Awal
  if (!title || !content || !category_id) {
    throw new Error("Judul, Konten, dan Kategori tidak boleh kosong!");
  }

  try {
    // Proses Upload
    if (file && file.size > 0) {
      imageUrl = await uploadToSupabase(file, "thumbnails");
    }

    // Proses Slug
    const finalSlug = manualSlug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    await prisma.info.create({
      data: {
        title,
        slug: finalSlug,
        content,
        thumbnail: imageUrl,
        status: status || "publish",
        category_id: category_id,
        is_active: true
      },
    });
  } catch (error: any) {
    console.error("❌ CREATE ERROR:", error.message);
    if (error.code === 'P2002') throw new Error("Slug sudah ada, ganti judul dikit!");
    throw new Error(error.message || "Gagal menyimpan ke database");
  }

  // ✅ REDIRECT DI LUAR TRY-CATCH (Anti-Digest Error)
  revalidatePath("/admin/info");
  revalidatePath("/warta");
  revalidatePath("/");
  redirect("/admin/info");
}

/**
 * 2. UPDATE ARTIKEL (EDIT)
 */
export async function updateInfo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const oldThumbnail = formData.get("oldThumbnail") as string;
  const file = formData.get("thumbnailFile") as File;

  if (!id) throw new Error("ID Artikel hilang!");

  let finalImageUrl = oldThumbnail;

  try {
    if (file && file.size > 0) {
      const uploadedUrl = await uploadToSupabase(file, "thumbnails");
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    await prisma.info.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        thumbnail: finalImageUrl,
        status: status || "publish",
        category_id: category_id,
        updated_at: new Date(),
      },
    });
  } catch (error: any) {
    console.error("❌ UPDATE ERROR:", error.message);
    if (error.code === 'P2002') throw new Error("Gagal! Slug ini sudah dipakai berita lain.");
    throw new Error(error.message || "Gagal update database");
  }

  // ✅ REDIRECT DI LUAR TRY-CATCH
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
  } catch (error: any) {
    console.error("❌ DELETE ERROR:", error.message);
    throw new Error("Gagal hapus data.");
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  revalidatePath("/");
}