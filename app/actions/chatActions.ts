"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FUNGSI KIRIM PESAN (SERVER-SIDE)
 * Jalur ini mem-bypass blokade "API DISABLED" di dashboard Supabase.
 */
export async function sendChatMessage(username: string, message: string) {
  // 1. Validasi Input Dasar
  if (!username.trim() || !message.trim()) {
    return { success: false, error: "Nama dan pesan tidak boleh kosong." };
  }

  try {
    const newMessage = await prisma.chatMessage.create({
      data: { 
        // Menghapus .toUpperCase() agar tidak terlihat kaku
        username: username.trim(), 
        message: message.trim() 
      },
    });

    // Memicu pembaruan data di sisi server Next.js
    revalidatePath("/");
    
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("Database Insert Error:", error);
    return { success: false, error: "Gagal menyuntikkan pesan ke database." };
  }
}

/**
 * FUNGSI AMBIL DATA PESAN
 * Mengambil 50 pesan terakhir untuk ditampilkan di area chat.
 */
export async function getChatMessages() {
  try {
    return await prisma.chatMessage.findMany({
      orderBy: { 
        created_at: "asc" 
      },
      take: 50,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    // Mengembalikan array kosong jika gagal, mencegah error "Invalid Date" di frontend
    return [];
  }
}