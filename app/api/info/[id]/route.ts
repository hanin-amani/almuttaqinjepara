import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Definisi Type untuk Next.js 15/16 (params as Promise)
type RouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * GET: Mengambil data artikel tunggal untuk halaman Edit
 */
export async function GET(req: Request, { params }: RouteProps) {
  try {
    // ✅ WAJIB: Await params dulu
    const { id } = await params;

    const info = await prisma.info.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!info) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(info);
  } catch (error) {
    console.error("GET_INFO_ERROR:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

/**
 * DELETE: Menghapus Artikel
 */
export async function DELETE(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    await prisma.info.delete({ 
      where: { id } 
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE_INFO_ERROR:", error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

/**
 * PATCH: Update Artikel
 */
export async function PATCH(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.info.update({
      where: { id },
      data: { 
        ...body, 
        updated_at: new Date() 
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH_INFO_ERROR:", error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}