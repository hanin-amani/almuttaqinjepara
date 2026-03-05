import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditInfoForm from "./EditInfoForm";

export default async function EditInfoPage({ params }: { params: { id: string } }) {
  const info = await prisma.info.findUnique({
    where: { id: params.id }
  });

  if (!info) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-emerald-900 mb-10 uppercase italic tracking-tighter text-left">
          Edit Artikel: {info.title} 📝
        </h1>
        
        {/* PERBAIKAN: Ganti 'info={info}' menjadi 'data={info}' */}
        <EditInfoForm data={info} />
      </div>
    </div>
  );
}