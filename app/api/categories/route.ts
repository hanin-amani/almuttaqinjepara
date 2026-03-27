// ✅ 1. ANTI-CACHE: Paksa API selalu ambil data terbaru dari Supabase
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    /**
     * ✅ 2. FIX MODEL NAME: 
     * Berdasarkan error build sebelumnya, model yang benar adalah 'infoCategory'.
     */
    const categories = await prisma.infoCategory.findMany({
      orderBy: { 
        name: "asc" 
      },
    });

    // ✅ 3. RETURN DATA: Pakai header Anti-Cache super ketat
    return NextResponse.json(categories || [], {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    // Log error di terminal Vercel agar Aris bisa pantau jika ada kendala koneksi
    console.error("❌ API CATEGORY ERROR:", error.message);
    
    /**
     * Balikkan array kosong [] agar frontend (InfoForm) tidak crash (.map error),
     * tapi tetap kirim status 500 sebagai tanda ada masalah di server.
     */
    return NextResponse.json([], { 
      status: 500,
      statusText: "Database Stun! Cek koneksi Supabase antum." 
    });
  }
}