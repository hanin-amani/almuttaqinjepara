import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditInfoForm from "./EditInfoForm";

// 🟢 MANTRA KEAMANAN MUTLAK: Mengunci halaman edit ke dinamis penuh agar lolos build Vercel tanpa drama
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function EditInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Ambil ID dari params (Next.js 15/16 mewajibkan await)
  const { id } = await params;
  let article = null;

  try {
    // 2. Ambil data artikel dari database Prisma dengan pengaman try-catch
    article = await prisma.info.findUnique({
      where: { id: id },
    });
  } catch (error) {
    // ✅ AMAN: Jika UUID tidak valid atau database tersendat, log eror ditangkap & halaman dialirkan ke 404 tanpa crash putih!
    console.error("💥 Gagal mengambil data artikel edit dari Supabase baru:", error);
    article = null;
  }

  // 3. Jika artikel tidak ditemukan atau database error, tampilkan halaman 404 secara rapi
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