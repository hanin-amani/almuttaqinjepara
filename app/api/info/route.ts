import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fungsi pembuat slug agar URL cantik dan SEO friendly
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Spasi jadi -
    .replace(/[^\w-]+/g, "")   // Hapus karakter aneh
    .replace(/--+/g, "-");     // Hapus double dash
}

// [GET] - Mengambil semua artikel untuk ditampilkan di tabel admin
export async function GET() {
  try {
    const infos = await prisma.info.findMany({
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Selalu kirim array (kosong [] atau ada isinya) dalam format JSON
    return NextResponse.json(infos || []);
  } catch (error: any) {
    console.error("❌ API GET ERROR:", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data dari database", details: error.message },
      { status: 500 }
    );
  }
}

// [POST] - Menyimpan artikel baru dari form admin
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, thumbnail, category_id, status, tags } = body;

    // Validasi dasar
    if (!title || !content || !category_id) {
      return NextResponse.json(
        { error: "Data belum lengkap! Judul, Konten, dan Kategori wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan ke database
    const newInfo = await prisma.info.create({
      data: {
        title,
        slug: `${slugify(title)}-${Math.floor(Math.random() * 10000)}`,
        content,
        thumbnail: thumbnail || null,
        category_id: category_id,
        status: status || "published",
        tags: tags || null,
        is_active: true,
      },
    });

    // Paksa Next.js update tampilan warta agar artikel baru langsung muncul
    revalidatePath("/warta");
    revalidatePath("/");

    return NextResponse.json(
      { message: "Warta berhasil diterbitkan!", data: newInfo },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ API POST ERROR:", error.message);
    return NextResponse.json(
      { error: "Gagal menyimpan ke database", details: error.message },
      { status: 500 }
    );
  }
}