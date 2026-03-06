"use client";

import Link from "next/link";
import Image from "next/image";

export default function InfoSection({ articles }: { articles: any[] }) {
  // Jika tidak ada data, tampilkan pesan kosong agar layout tidak rusak
  if (!articles || articles.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            Belum ada warta terbaru saat ini.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Warta <span className="text-emerald-600">Pondok</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              Kabar Terbaru & Materi Khutbah Al Muttaqin
            </p>
          </div>
          <Link 
            href="/warta" 
            className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100"
          >
            Lihat Semua Berita →
          </Link>
        </div>

        {/* Grid Kartu Warta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <Link 
              key={item.id} 
              href={`/warta/${item.slug}`}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                {item.thumbnail ? (
                  <Image 
                    src={item.thumbnail} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200 font-black italic text-xs">
                    AL MUTTAQIN
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
                    {item.category?.name || "Info"}
                  </span>
                </div>
              </div>

              {/* Konten Pendek */}
              <div className="p-6 flex flex-col flex-1">
                <time className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
                <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tight line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    Baca Selengkapnya
                  </span>
                  <span className="text-emerald-300 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ornamen Background */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
    </section>
  );
}