"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Newspaper } from "lucide-react";

export default function InfoSection({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-20 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="text-left border-l-4 border-emerald-600 pl-5">
            <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Kabar <span className="text-emerald-600">Pondok</span>
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Update Literasi & Warta Al Muttaqin
            </p>
          </div>
          
          <Link 
            href="/warta" 
            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-[4px] hover:bg-emerald-600 transition-all shadow-lg"
          >
            Lihat Semua <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ✅ GRID 4 KOLOM: grid-cols-1 (HP), grid-cols-2 (Tablet), grid-cols-4 (Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((item) => (
            <Link 
              key={item.id} 
              href={`/warta/${item.slug}`}
              className="group flex flex-col bg-white rounded-[4px] overflow-hidden border border-slate-100 hover:border-emerald-500/30 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Thumbnail: Aspect Ratio diubah ke 4/3 agar lebih compact */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                {item.thumbnail ? (
                  <Image 
                    src={item.thumbnail} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <Newspaper size={24} />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2 py-1 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-wider rounded-[2px]">
                    {item.category?.name || "Info"}
                  </span>
                </div>
              </div>

              {/* Konten: Font-size dikecilkan sedikit (text-base) agar pas di 4 kolom */}
              <div className="p-5 flex flex-col flex-1 text-left">
                <time className="text-[8px] font-bold text-slate-400 uppercase mb-2 block">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </time>

                <h3 className="text-sm md:text-base font-black text-slate-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors uppercase italic line-clamp-2">
                  {item.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                    Selengkapnya
                  </span>
                  <ChevronRight size={12} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}