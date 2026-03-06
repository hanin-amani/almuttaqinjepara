"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. TAMBAH ARTIKEL
export async function createInfo(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  await prisma.info.create({
    data: {
      title,
      slug,
      content,
      thumbnail,
      status: status || "publish",
      category_id: category_id || null,
    },
  });

  revalidatePath("/admin/info");
  revalidatePath("/warta");
  redirect("/admin/info");
}

// 2. UPDATE ARTIKEL (FITUR YANG TADI ERROR)
export async function updateInfo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as string;

  if (!id) throw new Error("ID tidak ditemukan untuk update");

  await prisma.info.update({
    where: { id: id },
    data: {
      title,
      content,
      thumbnail,
      status: status || "publish",
      category_id: category_id || null,
    },
  });

  // Refresh cache agar perubahan langsung muncul di Warta Pondok
  revalidatePath("/admin/info");
  revalidatePath("/warta");
  redirect("/admin/info");
}

// 3. HAPUS ARTIKEL
export async function deleteInfo(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.info.delete({
    where: { id: id },
  });

  revalidatePath("/admin/info");
  revalidatePath("/warta");
}