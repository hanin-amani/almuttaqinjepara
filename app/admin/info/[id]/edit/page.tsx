import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditInfoForm from "./EditInfoForm";

export default async function EditInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Ambil ID dari params (Next.js 16 mewajibkan await)
  const { id } = await params;

  // 2. Ambil data artikel dari database Prisma
  const article = await prisma.info.findUnique({
    where: { id: id },
  });

  // 3. Jika artikel tidak ditemukan, tampilkan halaman 404
  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        {/* PENTING: Nama prop harus 'data' agar sesuai dengan EditInfoForm Anda */}
        <EditInfoForm data={article} />
      </div>
    </main>
  );
}