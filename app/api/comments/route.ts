import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET: Mengambil diskusi netizen
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const infoId = searchParams.get("infoId");

  if (!infoId) return NextResponse.json([], { status: 200 });

  try {
    const comments = await prisma.comment.findMany({
      where: { 
        info_id: infoId, 
        is_approved: true 
      },
      // Urutan ASC agar obrolan mengalir ke bawah (balasan di bawah bapaknya)
      orderBy: { created_at: "asc" } 
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET_COMMENTS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * POST: Simpan Komentar atau Balasan
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { infoId, name, email, content, website, image, parent_id } = body;

    // Validasi input wajib
    if (!infoId || !content || !name) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" }, 
        { status: 400 }
      );
    }

    // ✅ FIX UUID: Pastikan parent_id dan info_id adalah UUID valid atau null
    // Database UUID tidak mau menerima string kosong ""
    const validParentId = parent_id && parent_id.length > 10 ? parent_id : null;

    const newComment = await prisma.comment.create({
      data: {
        info_id: infoId,
        name: name,
        email: email || "guest@rsm.id",
        content: content,
        website: website || null,
        image: image || null, 
        parent_id: validParentId, // ✅ Gunakan hasil filter di atas
        is_approved: true, 
      },
    });

    return NextResponse.json({ success: true, data: newComment });
  } catch (error: any) {
    // ⚠️ LIHAT TERMINAL VS CODE: Jika gagal, pesan error asli akan muncul di sana
    console.error("POST_COMMENT_ERROR:", error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal simpan. Pastikan migrasi database sudah selesai.",
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}