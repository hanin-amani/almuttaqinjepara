"use server";

import prisma from "@/lib/prisma";

// 🟢 MANTRA KEAMANAN: Memaksa runtime serverless memperlakukan action ini secara dinamis 
// agar Vercel tidak mencoba mengevaluasi dependensi halaman induk (/) saat proses build website!
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
        username: username.trim(), 
        message: message.trim() 
      },
    });

    // 🟢 AMAN: Kita matikan revalidatePath("/") karena sistem ruang chat antum 
    // sudah menggunakan Realtime Supabase Channel (.on("postgres_changes")) di frontend!
    // Mematikan ini akan langsung membantai eror timeout build di halaman 12 dan 18!
    
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("💥 Database Insert Error:", error);
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
    console.error("💥 Fetch Error Chat:", error);
    // Mengembalikan array kosong jika gagal, mencegah error "Invalid Date" di frontend
    return [];
  }
}