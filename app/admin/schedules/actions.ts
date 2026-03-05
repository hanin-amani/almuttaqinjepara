"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSchedule(formData: FormData) {
  const program_name = formData.get("program_name") as string;
  const day = formData.get("day") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;

  // PERBAIKAN: Ganti 'schedules' menjadi 'schedule'
  await prisma.schedule.create({
    data: {
      program_name,
      day,
      start_time,
      end_time,
    },
  });

  revalidatePath("/admin/schedules");
  revalidatePath("/"); 
}

export async function deleteSchedule(id: string) {
  // PERBAIKAN: Ganti 'schedules' menjadi 'schedule'
  await prisma.schedule.delete({
    where: { id },
  });
  revalidatePath("/admin/schedules");
  revalidatePath("/");
}