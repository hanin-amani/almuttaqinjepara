import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * [GET] - Mengambil semua artikel untuk tabel admin
 * Ditambahkan logika anti-cache agar daftar berita tidak "hilang"
 */
export async function GET(req: NextRequest) {
  try {
    const infos = await prisma.info.findMany({
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // ✅ Header No-Cache: Memastikan Vercel tidak menyimpan data lama
    return NextResponse.json(infos || [], {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("❌ API GET ERROR:", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data. Cek koneksi Supabase antum." },
      { status: 500 }
    );
  }
}

/**
 * [POST] - Menyimpan artikel baru
 * Mendukung fitur Auto-Slug dari Frontend
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, thumbnail, category_id, status, tags, slug: manualSlug } = body;

    // 1. Validasi Dasar
    if (!title || !content || !category_id) {
      return NextResponse.json(
        { error: "Waduh Aris, data belum lengkap! Judul, Konten, dan Kategori wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Logika Slug (Pakai slug manual dari UI, atau generate jika kosong)
    const finalSlug = manualSlug 
      ? manualSlug 
      : title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") + "-" + Math.floor(Math.random() * 1000);

    // 3. Simpan ke Prisma
    const newInfo = await prisma.info.create({
      data: {
        title,
        slug: finalSlug,
        content,
        thumbnail: thumbnail || null,
        category_id: category_id,
        status: status || "publish", // Normalisasi ke 'publish'
        tags: tags || null,
        is_active: true,
      },
    });

    // 4. Paksa Next.js 16 update tampilan (Purge Cache)
    revalidatePath("/admin/info");
    revalidatePath("/warta");
    revalidatePath("/");

    return NextResponse.json(
      { message: "Warta berhasil diterbitkan, Aris! Savage!", data: newInfo },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ API POST ERROR:", error.message);
    
    // Cek jika error karena Slug Duplikat (P2002 di Prisma)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Slug/URL sudah dipakai berita lain. Coba ganti judul sedikit." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menyimpan ke database", details: error.message },
      { status: 500 }
    );
  }
}