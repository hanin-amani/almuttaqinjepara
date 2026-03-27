// ✅ 1. KUNCI UTAMA: Paksa API selalu ambil data terbaru dari database
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 2. Ambil kategori (Sesuaikan nama model: 'category' atau 'infoCategory')
    // Saya sesuaikan dengan model 'category' yang biasa kita pakai sebelumnya
    const categories = await prisma.category.findMany({
      orderBy: { 
        name: "asc" 
      },
    });

    // ✅ 3. Return dengan header Anti-Cache super ketat
    return NextResponse.json(categories || [], {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("❌ API CATEGORY ERROR:", error.message);
    
    // Kirim array kosong agar frontend tidak crash, tapi kasih log di server
    return NextResponse.json([], { 
      status: 500,
      statusText: "Gagal mengambil kategori. Cek koneksi Supabase Aris!" 
    });
  }
}