import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * INFO SECTION - RADIO SUARA AL MUTTAQIN
 * Menampilkan 3 berita terbaru dengan status 'published'.
 * Server Component - READ ONLY.
 */
export default async function InfoSection() {
  try {
    const latestInfos = await prisma.info.findMany({
      where: {
        is_active: true,
        status: "published",
      },
      include: {
        category: true, // TAMBAHKAN INI agar data kategori ikut terambil
      },
      orderBy: {
        created_at: "desc",
      },
      take: 3,
    });

    if (!latestInfos || latestInfos.length === 0) return null;

    const cleanText = (html: string) =>
      html ? html.replace(/<[^>]*>?/gm, "").trim() : "";

    return (
      <section id="warta" className="py-16 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] italic">
                Kabar Terbaru dari Pondok
              </h2>
              <h3 className="text-4xl font-black text-emerald-950 uppercase italic tracking-tighter leading-none">
                Warta Pondok 📢
              </h3>
            </div>

            <Link
              href="/info"
              className="group inline-flex items-center gap-2 text-emerald-700 font-black text-[11px] uppercase tracking-widest hover:text-emerald-500 transition-all border-b-2 border-emerald-100 pb-1"
            >
              Lihat Semua Berita
              <span className="group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestInfos.map((info) => (
              <article
                key={info.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:border-emerald-400 hover:shadow-2xl transition-all duration-500"
              >
                {/* Thumbnail */}
                <div className="w-full h-44 relative overflow-hidden bg-gray-100">
                  {info.thumbnail ? (
                    <img
                      src={info.thumbnail}
                      alt={info.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-950 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-emerald-100">
                      {/* PERBAIKAN: Akses nama kategori melalui objek relasi */}
                      {info.category?.name || "Umum"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <time className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">
                    {info.created_at
                      ? new Date(info.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </time>

                  <h4 className="text-xl font-black text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight uppercase italic tracking-tight">
                    {info.title}
                  </h4>

                  <p className="text-gray-500 text-[11px] leading-relaxed mb-8 line-clamp-3 font-medium opacity-80">
                    {cleanText(info.content)}
                  </p>

                  <Link
                    href={`/info/${info.slug}`}
                    className="mt-auto pt-5 border-t border-gray-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-between group/btn"
                  >
                    Selengkapnya
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("InfoSection Error:", error);
    return null;
  }
}