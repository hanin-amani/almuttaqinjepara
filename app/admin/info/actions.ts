"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Supabase Client (SERVER SIDE)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ BUCKET YANG BENAR
const BUCKET = "thumbnails";

/**
 * HELPER: Upload ke Supabase Storage
 */
async function uploadToSupabase(file: File, folder: string) {
  if (!file || file.size === 0) return null;

  try {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    const filePath = `${folder}/${fileName}`;

    const buffer = await file.arrayBuffer();
    const fileData = new Uint8Array(buffer);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, fileData, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("SUPABASE STORAGE ERROR:", error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;

  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    throw new Error("Gagal upload gambar ke storage.");
  }
}

/**
 * HELPER: Generate Slug
 */
function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * CREATE ARTIKEL
 */
export async function createInfo(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const manualSlug = formData.get("slug") as string;
  const file = formData.get("thumbnailFile") as File;

  if (!title || !content || !category_id) {
    throw new Error("Judul, Konten, dan Kategori wajib diisi.");
  }

  let imageUrl: string | null = null;

  try {

    if (file && file.size > 0) {
      imageUrl = await uploadToSupabase(file, "posts");
    }

    const finalSlug = manualSlug || generateSlug(title);

    await prisma.info.create({
      data: {
        title,
        slug: finalSlug,
        content,
        thumbnail: imageUrl,
        status: status || "publish",
        category_id,
        is_active: true,
      },
    });

  } catch (error: any) {

    console.error("CREATE ERROR:", error);

    if (error.code === "P2002") {
      throw new Error("Slug sudah ada. Ganti judul sedikit.");
    }

    throw new Error(error.message || "Gagal menyimpan artikel.");
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  revalidatePath("/");
  redirect("/admin/info");
}

/**
 * UPDATE ARTIKEL
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

  if (!id) throw new Error("ID artikel tidak ditemukan.");

  let finalImageUrl = oldThumbnail;

  try {

    if (file && file.size > 0) {
      const uploadedUrl = await uploadToSupabase(file, "posts");
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
        category_id,
        updated_at: new Date(),
      },
    });

  } catch (error: any) {

    console.error("UPDATE ERROR:", error);

    if (error.code === "P2002") {
      throw new Error("Slug sudah dipakai artikel lain.");
    }

    throw new Error("Gagal update artikel.");
  }

  revalidatePath("/admin/info");
  revalidatePath(`/warta/${slug}`);
  revalidatePath("/");
  redirect("/admin/info");
}

/**
 * DELETE ARTIKEL
 */
export async function deleteInfo(formData: FormData) {

  const id = formData.get("id") as string;

  if (!id) return;

  try {

    await prisma.info.delete({
      where: { id },
    });

  } catch (error: any) {

    console.error("DELETE ERROR:", error);
    throw new Error("Gagal menghapus artikel.");
  }

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  revalidatePath("/");
}