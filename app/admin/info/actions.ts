"use server";

import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

/////////////////////////////////////////////////////
// CREATE INFO
/////////////////////////////////////////////////////

export async function createInfo(formData: FormData) {

  try {

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const status = formData.get("status") as string;

    const slug = generateSlug(title);

    await prisma.info.create({
      data: {
        title,
        slug,
        content,
        thumbnail,
        status,
        category_id: category || null
      }
    });

    return { success: true };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: "Gagal membuat artikel"
    };

  }

}

/////////////////////////////////////////////////////
// UPDATE INFO
/////////////////////////////////////////////////////

export async function updateInfo(id: string, formData: FormData) {

  try {

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const status = formData.get("status") as string;

    const slug = generateSlug(title);

    await prisma.info.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        thumbnail,
        status,
        category_id: category || null
      }
    });

    return { success: true };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: "Gagal update artikel"
    };

  }

}

/////////////////////////////////////////////////////
// DELETE INFO
/////////////////////////////////////////////////////

export async function deleteInfo(formData: FormData) {

  try {

    const id = formData.get("id") as string;

    await prisma.info.delete({
      where: { id }
    });

  } catch (error) {

    console.error(error);

  }

}