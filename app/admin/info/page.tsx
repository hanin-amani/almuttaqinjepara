import prisma from "@/lib/prisma";
import InfoForm from "./InfoForm";
import DeleteButton from "./DeleteButton"; // Import komponen client baru
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  // 1. Mengambil data artikel lengkap dengan kategorinya
  const infos = await prisma.info.findMany({
    include: {
      category: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Fungsi Helper untuk membersihkan tag HTML agar preview teks rapi
  const stripHtml = (html: string) => {
    return html ? html.replace(/<[^>]*>?/gm, "") : "";
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* Header Manajemen - Khas Al Muttaqin */}
      <div className="bg-emerald-950 pt-20 pb-32 px-6 text-center mb-[-80px]">
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
            Manajemen <span className="text-emerald-400">Artikel / Berita</span>
          </h1>
          <p className="mt-4 text-emerald-100/60 font-medium text-[10px] md:text-xs uppercase tracking-[0.3em]">
            Pusat Kendali Warta Pondok Pesantren Islam Al Muttaqin Jepara
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-20">
        {/* Form Tambah Artikel */}
        <div className="mb-16">
          <InfoForm />
        </div>

        {/* List Artikel Terbaru */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Daftar Artikel Diterbitkan ({infos.length})
            </h2>
          </div>

          <div className="grid gap-6">
            {infos.map((info) => (
              <div
                key={info.id}
                className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                {/* Thumbnail Preview */}
                <div className="w-full md:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                  {info.thumbnail ? (
                    <img 
                      src={info.thumbnail} 
                      alt={info.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-black italic uppercase text-center p-4">
                      Warta <br/> Al Muttaqin
                    </div>
                  )}
                </div>

                {/* Konten Artikel */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {info.category?.name || "Umum"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(info.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors uppercase italic tracking-tight leading-tight">
                    {info.title}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
                    {stripHtml(info.content).slice(0, 150)}...
                  </p>
                </div>

                {/* Aksi: Edit & Hapus */}
                <div className="flex flex-row md:flex-col gap-3 flex-shrink-0">
                  <Link 
                    href={`/admin/info/${info.id}/edit`}
                    className="bg-white hover:bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="Edit Artikel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>

                  {/* Tombol Hapus (Client Component) */}
                  <DeleteButton id={info.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}