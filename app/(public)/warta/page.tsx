import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getAllArticles() {
  return await prisma.info.findMany({
    where: { 
      status: "publish", 
      is_active: true 
    },
    include: { category: true },
    orderBy: { created_at: "desc" },
  });
}

export default async function WartaListPage() {
  const articles = await getAllArticles();

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section - Disesuaikan agar tidak terlalu tinggi */}
      <section className="bg-emerald-950 pt-28 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-3">
            Warta <span className="text-yellow-400">Pondok</span>
          </h1>
          <p className="text-emerald-200/80 text-[10px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed">
            Pusat Informasi & Kabar Terbaru Radio Suara Al Muttaqin
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/20 rounded-full blur-[100px]"></div>
      </section>

      {/* Kontainer Artikel - Dibatasi max-w-5xl agar sejajar header/footer */}
      <div className="container mx-auto px-6 max-w-5xl -mt-8">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link 
                href={`/warta/${article.slug}`} 
                key={article.id}
                className="group bg-white rounded-[1.5rem] overflow-hidden shadow-lg shadow-slate-200/60 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col border border-slate-100 hover:border-emerald-200"
              >
                {/* Thumbnail - Aspect Video agar lebih tipis */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {article.thumbnail ? (
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200 text-3xl">
                      📻
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-900 text-[8px] font-black uppercase tracking-widest shadow-sm border border-emerald-50">
                      {article.category?.name || "Warta"}
                    </span>
                  </div>
                </div>

                {/* Konten Kartu - Padding dikurangi dari p-8 ke p-6 */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <time className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                  
                  <h2 className="text-lg font-black text-slate-900 leading-tight mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase italic tracking-tight">
                    {article.title}
                  </h2>

                  <p className="text-slate-500 text-[11px] font-medium line-clamp-2 mb-5 leading-relaxed">
                    {article.excerpt || "Klik untuk membaca kabar selengkapnya dari Pondok..."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      Baca Selengkapnya <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[2rem] text-center shadow-md border border-slate-50">
            <h2 className="text-lg font-black text-slate-900 uppercase italic">Belum Ada Warta</h2>
          </div>
        )}
      </div>
    </main>
  );
}