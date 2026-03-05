"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInfo(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    throw new Error("Judul dan konten wajib diisi");
  }

  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  await prisma.info.create({
    data: {
      title,
      slug,
      content,
      status: "publish",
      is_active: true,
    },
  });

  revalidatePath("/admin/info");
}

export async function deleteInfo(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.info.delete({
    where: { id },
  });

  revalidatePath("/admin/info");
}