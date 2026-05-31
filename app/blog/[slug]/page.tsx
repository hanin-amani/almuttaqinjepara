"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CommentSection from "@/components/CommentSection"; // Memanggil komponen diskusi baru
import { 
  Loader2, 
  Calendar, 
  Clock,
  Share2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

// Data Mockup untuk 6 Postingan Rekomendasi
const RECOMMENDATIONS_MOCK = [
  {
    id: "rec-1",
    title: "Amerika Serikat Sita Aset Kripto Iran Rp 17,82 Triliun",
    img: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rec-2",
    title: "Cek Rincian Harga Emas 24 Karat di Antam, Pegadaian, dan Hartadinata",
    img: "https://images.unsplash.com/photo-1610374792793-f016b77ca51a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rec-3",
    title: "Studi: Konflik AS-China soal Taiwan Bisa Picu Perang Nuklir",
    img: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rec-4",
    title: "Coinbase dan Kalshi Menghadirkan Kontrak Berjangka Kripto ke Investor",
    img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rec-5",
    title: "Wall Street Perkasa, Indeks Nasdaq Melambung 8% Sepanjang Mei 2026",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rec-6",
    title: "Harga Minyak Anjlok, Brent Alami Penurunan Bulanan Terbesar dalam Enam Tahun",
    img: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=400&q=80",
  },
];

// Fungsi pembantu untuk membuat slug teks dari judul (untuk fallback/rekomendasi)
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function DetailWartaPage() {
  const { slug } = useParams(); // Menggunakan slug murni dari parameter routing URL
  const router = useRouter();

  // State Berita Blogger
  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [errorPost, setErrorPost] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setErrorPost("Slug URL artikel tidak valid.");
      setLoadingPost(false);
      return;
    }

    // Ambil Data Detail Artikel dari Blogger API menggunakan Query Search Slug
    async function fetchDetailPost() {
      const apiKey = process.env.NEXT_PUBLIC_BLOGGER_API_KEY;
      const blogId = process.env.NEXT_PUBLIC_BLOGGER_BLOG_ID;

      try {
        // Menggunakan endpoint /search untuk melacak artikel berdasarkan fragmen slug kata kunci
        const res = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/search?q=${slug}&key=${apiKey}`
        );
        
        if (!res.ok) throw new Error("Artikel tidak ditemukan atau sudah dihapus dari Blogger.");
        
        const data = await res.json();
        
        // Memvalidasi & mencocokkan slug url asli dari item blogger demi presisi data yang absolut
        const matchedPost = data.items?.find((item: any) => {
          if (!item.url) return false;
          const parts = item.url.split("/");
          const filename = parts[parts.length - 1].replace(".html", "");
          return filename === slug;
        });

        if (!matchedPost) {
          throw new Error("Artikel dengan slug tersebut tidak ditemukan.");
        }

        setPost(matchedPost);
      } catch (err: any) {
        console.error("💥 Error Detail Fetch:", err);
        setErrorPost(err.message || "Gagal memuat detail artikel.");
      } finally {
        setLoadingPost(false);
      }
    }

    fetchDetailPost();
  }, [slug]);

  // Fungsi Parser untuk menyisipkan Fitur "Baca Juga" tepat setelah paragraf ke-5
  const renderContentWithBacaJuga = (htmlContent: string) => {
    if (!htmlContent) return null;

    let splitIndex = -1;

    // Cara 1: Deteksi berbasis tag penutup paragraf HTML </p>
    let currentPosP = 0;
    let pCount = 0;
    let lastPEnd = -1;

    while (pCount < 5) {
      const idx = htmlContent.indexOf("</p>", currentPosP);
      if (idx === -1) break;
      lastPEnd = idx;
      pCount++;
      currentPosP = idx + 4;
    }

    if (pCount === 5 && lastPEnd !== -1) {
      splitIndex = lastPEnd + 4;
    }

    // Cara 2: Jika tidak menggunakan tag <p>, deteksi berbasis marker span paragraf baru yang kita buat
    if (splitIndex === -1) {
      const marker = 'class="block my-6"';
      let currentPosMarker = 0;
      let markerCount = 0;
      let lastMarkerEnd = -1;

      while (markerCount < 5) {
        const idx = htmlContent.indexOf(marker, currentPosMarker);
        if (idx === -1) break;
        const tagEnd = htmlContent.indexOf("</span>", idx);
        if (tagEnd === -1) break;
        lastMarkerEnd = tagEnd + 7;
        markerCount++;
        currentPosMarker = tagEnd + 7;
      }

      if (markerCount === 5 && lastMarkerEnd !== -1) {
        splitIndex = lastMarkerEnd;
      }
    }

    // Jika artikel terlalu pendek (tidak sampai 5 paragraf), langsung render utuh
    if (splitIndex === -1) {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }

    const paragraphGroupOne = htmlContent.substring(0, splitIndex);
    const paragraphGroupTwo = htmlContent.substring(splitIndex);

    const targetLink = RECOMMENDATIONS_MOCK[1]; 
    const targetSlug = `${slugify(targetLink.title)}-${targetLink.id}`;

    return (
      <>
        {/* Paragraf 1 s.d 5 */}
        <div dangerouslySetInnerHTML={{ __html: paragraphGroupOne }} />

        {/* BOX FITUR BACA JUGA */}
        <div className="my-8 p-5 bg-orange-50/50 border-l-4 border-orange-500 rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs not-prose">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Baca Juga</span>
            <Link 
              href={`/blog/${targetSlug}`} 
              className="text-slate-900 font-extrabold text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-2 leading-snug"
            >
              {targetLink.title}
            </Link>
          </div>
          <Link 
            href={`/blog/${targetSlug}`} 
            className="text-orange-600 text-xs font-bold shrink-0 flex items-center gap-1 hover:underline uppercase tracking-wider"
          >
            Selengkapnya <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Paragraf 6 dan seterusnya */}
        <div dangerouslySetInnerHTML={{ __html: paragraphGroupTwo }} />
      </>
    );
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-orange-600" size={36} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Memuat Artikel Liputan Al Muttaqin...</p>
      </div>
    );
  }

  if (errorPost || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-md">
          <p className="text-red-500 font-black uppercase text-xs tracking-wider mb-4">💥 ERROR TERJADI</p>
          <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">{errorPost}</p>
          <button onClick={() => router.push("/blog")} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Kembali ke Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-left font-sans text-slate-900 antialiased pb-24">
      
      {/* BREADCRUMBS (Remah Roti) */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <Link href="/" className="text-slate-400 hover:text-orange-600 transition-colors">
            Home
          </Link>

          <ChevronRight size={12} strokeWidth={3} className="text-slate-300 shrink-0" />

          <Link href="/blog" className="text-slate-400 hover:text-orange-600 transition-colors">
            Blog Pondok
          </Link>

          {post.labels && post.labels.length > 0 && (
            <>
              <ChevronRight size={12} strokeWidth={3} className="text-slate-300 shrink-0" />
              <span className="text-orange-600 font-bold">{post.labels[0]}</span>
            </>
          )}
        </nav>
      </div>

      {/* TWO-COLUMN MAIN LAYOUT GRID */}
      <div className="max-w-6xl mx-auto px-4 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* KOLOM KIRI: KONTEN UTAMA ARTIKEL, KOMENTAR, & REKOMENDASI */}
        <article className="lg:col-span-2">
                              
          {/* Judul Besar Utama */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-700 tracking-tight leading-tight mb-4 text-left">
            {post.title}
          </h1>

          {/* Metadata Penulis & Tanggal Rilis */}
          <div className="flex flex-wrap items-center justify-between border-y border-slate-100 py-3 mb-6 text-slate-500 text-xs gap-4">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Oleh</span>
                <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                  {post.author?.displayName || "Admin Media Center"}
                </span>
              </div>
              <div className="text-slate-300 hidden sm:inline">|</div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar size={13} className="text-slate-400" />
                <span>Diterbitkan {new Date(post.published).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock size={13} />
                <span>{new Date(post.published).toLocaleTimeString("id-ID", { hour: '2-digit', minute:'2-digit' })} WIB</span>
              </div>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Tautan artikel berhasil disalin!");
              }}
              className="text-slate-400 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 bg-slate-50"
              title="Bagikan Tautan"
            >
              <Share2 size={13} /> <span className="uppercase text-[10px] font-bold tracking-wider">Bagikan</span>
            </button>
          </div>

          {/* ISI ARTIKEL HTML UTAMA DENGAN JEDA PARAGRAF & BACA JUGA */}
          <div 
            className="prose prose-slate max-w-none text-slate-800 text-base font-normal text-left
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
              prose-p:mb-8 prose-p:leading-relaxed prose-p:text-left [&_p]:mb-8 [&_p]:leading-relaxed [&_p]:text-left
              [&_img]:aspect-video [&_img]:w-full [&_img]:object-cover [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:mx-auto
              prose-a:text-orange-600 prose-a:font-semibold hover:prose-a:text-slate-900"
          >
            {renderContentWithBacaJuga(
              post.content
                ?.replace(/<p>(&nbsp;|\s)*<\/p>/gi, "")
                ?.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<span class="block my-6 text-left"></span>')
            )}
          </div>

          {/* SEKTOR RUANG DISKUSI NETIZEN */}
          <CommentSection infoId={post.id as string} />

          {/* SEKSI REKOMENDASI */}
          <div className="mt-16 pt-12 border-t border-slate-100">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-6">
              Rekomendasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
              {RECOMMENDATIONS_MOCK.map((item) => (
                <Link 
                  href={`/blog/${slugify(item.title)}-${item.id}`} 
                  key={item.id} 
                  className="group block space-y-2.5"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-slate-900 font-bold text-xs md:text-sm leading-snug line-clamp-3 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

        </article>

        {/* KOLOM KANAN: SIDEBAR POPULER & TERKINI */}
        <aside className="aside lg:col-span-1 space-y-8 sticky top-6">
          
          {/* SEKSI 1: TOPIK POPULER */}
          <div className="bg-white rounded-xl p-2">
            <h3 className="text-orange-600 font-extrabold text-xs uppercase tracking-wider mb-3">
              Topik Populer
            </h3>
            <ul className="space-y-2">
              {post.labels && post.labels.length > 0 ? (
                post.labels.map((topic: string, idx: number) => (
                  <li key={idx} className="border-b border-slate-100 pb-2 flex items-center gap-2 last:border-0">
                    <span className="text-orange-500 font-extrabold text-sm">#</span>
                    <span className="text-slate-800 font-bold text-xs uppercase tracking-wide hover:text-orange-600 cursor-pointer transition-colors">
                      {topic.replace(/\s+/g, '_')}
                    </span>
                  </li>
                ))
              ) : (
                ["WARTA_PONDOK", "INFO_KAMPUS"].map((topic, idx) => (
                  <li key={idx} className="border-b border-slate-100 pb-2 flex items-center gap-2 last:border-0">
                    <span className="text-orange-500 font-extrabold text-sm">#</span>
                    <span className="text-slate-800 font-bold text-xs uppercase tracking-wide hover:text-orange-600 cursor-pointer transition-colors">
                      {topic}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* SEKSI 2: LIST ARTIKEL POPULER */}
          <div className="bg-white rounded-xl p-2">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">
                Populer
              </h3>
              <Link href="/blog" className="text-orange-600 text-[10px] font-bold hover:underline flex items-center gap-0.5 uppercase">
                Look All <ChevronRight size={10} strokeWidth={3} />
              </Link>
            </div>
            
            <div className="relative w-full overflow-hidden rounded-xl mb-4 group cursor-pointer shadow-md">
              <div className="relative w-full aspect-[16/9] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Warta Utama"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">
                  SAHAM / BLOG
                </span>
                <p className="text-white font-bold text-sm leading-snug line-clamp-2">
                  IHSG Sepekan Turun 0,56%, Rebalancing MSCI hingga Dampak Global
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                { cat: "SAHAM", title: "Daftar 10 Saham Top Gainers Sepekan, Ada BREN, GULA, BBHI hingga..." },
                { cat: "SAHAM", title: "Bursa Masukkan Saham TCPI Kategori Kepemilikan Saham Terkonsentrasi" },
                { cat: "SAHAM", title: "Daftar 10 Saham Top Losers pada Pekan Akhir Mei 2026" },
                { cat: "PONDOK", title: "DOID Raup Pendapatan USD 318 Juta di Kuartal I 2026" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-4xl font-black text-slate-400 tracking-tighter leading-none w-7 text-center shrink-0">
                    {idx + 2}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">
                      {item.cat}
                    </span>
                    <p className="text-slate-800 font-bold text-xs leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 3: BERITA TERKINI */}
          <div className="bg-white rounded-xl p-2">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">
                Berita Terkini
              </h3>
              <Link href="/blog" className="text-orange-600 text-[10px] font-bold hover:underline flex items-center gap-0.5 uppercase">
                Lihat Semua <ChevronRight size={10} strokeWidth={3} />
              </Link>
            </div>

            <div className="mb-4 group cursor-pointer">
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-2 bg-slate-100 shadow-xs">
                <img 
                  src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=500&q=80" 
                  alt="WHO Vape" 
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
              <h4 className="text-slate-900 font-extrabold text-xs md:text-sm leading-snug hover:text-orange-600 transition-colors">
                WHO Soroti Makin Banyak Remaja Indonesia Pakai Vape
              </h4>
            </div>

            <div className="space-y-3">
              {[
                { img: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=100&h=100&q=80", title: "Kapan Mulai dan Berakhirnya Gema Takbir Idul Adha 2026?" },
                { img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=100&h=100&q=80", title: "8 Tanaman Dapur yang Bisa Dipanen Berkali-kali di Rumah" },
                { img: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=100&h=100&q=80", title: "Harga Kripto Hari Ini 31 Mei 2026: Bitcoin Menguat Tajam" },
                { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&h=100&q=80", title: "Uni Eropa Sebut Hubungan Perdagangan dengan China Memanas" }
              ].map((news, idx) => (
                <div key={idx} className="flex gap-3 items-center border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="w-16 aspect-video object-cover rounded-lg bg-slate-100 shrink-0 shadow-2xs overflow-hidden">
                    <img 
                      src={news.img} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="text-slate-800 font-bold text-xs leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
                    {news.title}
                  </h5>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
}