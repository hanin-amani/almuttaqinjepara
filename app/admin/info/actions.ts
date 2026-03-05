"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ================================
   Helper: Generate Slug
================================ */
function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const random = Math.random().toString(36).substring(2, 6);

  return `${baseSlug}-${random}`;
}

/* ================================
   Helper: Generate Excerpt
================================ */
function generateExcerpt(content: string) {
  const plain = content.replace(/<[^>]*>?/gm, "");
  return plain.substring(0, 150) + (plain.length > 150 ? "..." : "");
}

/* ================================
   TAMBAH BERITA
================================ */
export async function addInfo(formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const thumbnail = (formData.get("thumbnail") as string) || "";
    const status = (formData.get("status") as string) || "published";

    if (!title || !content) {
      return { success: false, error: "Judul dan konten wajib diisi." };
    }

    const slug = generateSlug(title);

    await prisma.info.create({
      data: {
        title,
        slug,
        content,
        category,
        thumbnail,
        status,
        is_active: true,
        excerpt: generateExcerpt(content),
      },
    });

    revalidatePath("/admin/info");
    revalidatePath("/info");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Gagal menambah berita:", error);
    return { success: false, error: "Gagal menyimpan berita." };
  }
}

/* ================================
   UPDATE BERITA
================================ */
export async function updateInfo(id: string, formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const thumbnail = (formData.get("thumbnail") as string) || "";
    const status = (formData.get("status") as string) || "published";

    if (!id || !title || !content) {
      return { success: false, error: "Data tidak lengkap." };
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    await prisma.info.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        category,
        thumbnail,
        status,
        excerpt: content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...",
      },
    });

    revalidatePath("/admin/info");
    revalidatePath("/info");
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error("Gagal update berita:", error);
    return { success: false, error: "Gagal memperbarui informasi." };
  }
}

/* ================================
   HAPUS BERITA
================================ */
export async function deleteInfo(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "ID tidak ditemukan." };
    }

    await prisma.info.delete({
      where: { id },
    });

    revalidatePath("/admin/info");
    revalidatePath("/info");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus berita:", error);
    return { success: false, error: "Gagal menghapus data." };
  }
}