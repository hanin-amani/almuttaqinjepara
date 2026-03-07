"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// FUNGSI KIRIM: Sudah benar
export async function sendChatMessage(username: string, message: string) {
  try {
    const newMessage = await prisma.chatMessage.create({
      data: { username: username.toUpperCase(), message: message },
    });
    revalidatePath("/");
    return { success: true, data: newMessage };
  } catch (error) {
    return { success: false, error: "Gagal menyuntikkan pesan ke database." };
  }
}

// FUNGSI AMBIL DATA: Bypass blokade API Supabase
export async function getChatMessages() {
  try {
    return await prisma.chatMessage.findMany({
      orderBy: { created_at: "asc" },
      take: 50,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}