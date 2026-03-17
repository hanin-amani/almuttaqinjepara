import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mengambil data artikel tunggal untuk halaman Edit
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const info = await prisma.info.findUnique({
      where: { id: params.id },
      include: { category: true }
    });
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// Menghapus Artikel
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.info.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

// Update Artikel
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.info.update({
      where: { id: params.id },
      data: { ...body, updated_at: new Date() }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}