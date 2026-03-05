import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PublicInfoPage() {
  // 1. Mengambil informasi yang aktif, dipublish, DAN menyertakan data kategorinya
  const infos = await prisma.info.findMany({
    where: { 
      is_active: true,
      status: "published" 
    },
    include: {
      category: true, // WAJIB TAMBAHKAN INI agar data kategori bisa diakses
    },
    orderBy: { created_at: "desc" },
  });

  // Fungsi Helper untuk membersihkan tag HTML agar excerpt rapi
  const cleanText = (html: string) => {
    return html ? html.replace(/<[^>]*>?/gm, '') : ""; 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Header Warta Pondok */}
      <div className="bg-emerald-900 py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
            Warta Pondok 📢
          </h1>
          <p className="text-emerald-200 font-medium text-sm md:text-base max-w-xl mx-auto uppercase tracking-widest opacity-80">
            Kumpulan berita dan pengumuman terbaru Radio Suara Al Muttaqin Purwokerto.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Grid Informasi - Kumpulan Card Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infos.map((info) => (
            <Link 
              key={info.id} 
              href={`/info/${info.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Thumbnail Section */}
              {info.thumbnail && (
                <div className="w-full h-48 relative overflow-hidden">
                  <img 
                    src={info.thumbnail} 
                    alt={info.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  {/* PERBAIKAN: Menggunakan info.category.name dengan optional chaining */}
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {info.category?.name || "Umum"}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(info.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Judul Artikel */}
                <h2 className="text-lg font-black text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight uppercase italic tracking-tight line-clamp-2">
                  {info.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-3 font-medium">
                  {cleanText(info.content || "")}
                </p>

                <div className="mt-auto pt-4 border-t border-emerald-50 flex items-center justify-between text-emerald-600">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Baca Detail
                  </span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}

          {/* State Jika Berita Kosong */}
          {infos.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-emerald-200">
              <div className="text-5xl mb-4">📜</div>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                Belum ada warta pondok yang diterbitkan.
              </p>
            </div>
          )}
        </div>

        {/* Footer info pondok */}
        <div className="mt-24 text-center border-t border-gray-100 pt-12">
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.5em]">
            Pusat Informasi Radio Suara Al Muttaqin • Purwokerto
          </p>
        </div>
      </div>
    </div>
  );
}