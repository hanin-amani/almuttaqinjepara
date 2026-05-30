"use server";

import prisma from "@/lib/prisma";

// 🟢 KEMBALI SUCI: Dua baris export const dynamic kemarin dihapus dari sini karena Server Actions tidak membutuhkannya!

/**
 * FUNGSI KIRIM PESAN (SERVER-SIDE)
 */
export async function sendChatMessage(username: string, message: string) {
  if (!username.trim() || !message.trim()) {
    return { success: false, error: "Nama dan pesan tidak boleh kosong." };
  }

  try {
    const newMessage = await prisma.chatMessage.create({
      data: { 
        username: username.trim(), 
        message: message.trim() 
      },
    });
    
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("💥 Database Insert Error:", error);
    return { success: false, error: "Gagal menyuntikkan pesan ke database." };
  }
}

/**
 * FUNGSI AMBIL DATA PESAN
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
    console.error("💥 Fetch Error Chat:", error);
    return [];
  }
}