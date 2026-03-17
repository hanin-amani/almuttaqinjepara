import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.infoCategory.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil kategori" }, { status: 500 });
  }
}