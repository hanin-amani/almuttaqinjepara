import Link from "next/link";

// Konfigurasi Metadata SEO
export const metadata = {
  title: "Analisis Statistik | Admin Radio Al Muttaqin",
};

export default async function StatsPage() {
  // 1. Fetch data real-time & Analytics dari AzuraCast
  // Catatan: Data historical idealnya diambil dari endpoint /analytics station Anda
  let radioData = null;
  try {
    const res = await fetch("https://rsm.my.id/api/nowplaying/salaam", { 
      next: { revalidate: 30 } 
    });
    radioData = await res.json();
  } catch (error) {
    console.error("Gagal fetching data AzuraCast:", error);
  }

  const listeners = radioData?.listeners || { total: 0, unique: 0 };
  const nowPlaying = radioData?.now_playing?.song?.text || "Tidak ada lagu";

  // Data Mock (Simulasi data dari API Analytics AzuraCast)
  const historyStats = {
    weekly: { total: 1250, peak: 45, avg: 12 },
    monthly: { total: 5400, peak: 89, avg: 15 },
    yearly: { total: 68200, peak: 210, avg: 18 }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Navigasi */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-black text-emerald-950 tracking-tighter uppercase italic leading-none">
              Dashboard <span className="text-emerald-500">Analitik</span> 📊
            </h1>
            <p className="text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-[0.3em]">
              Memantau Jangkauan Dakwah Radio Suara Al Muttaqin
            </p>
          </div>
          <Link 
            href="/admin" 
            className="px-8 py-4 bg-emerald-950 text-white rounded-[1.5rem] font-black hover:bg-emerald-800 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Baris 1: Live Metrics (Real-time) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pendengar Live</p>
              <div className="flex items-end gap-3">
                <span className="text-7xl font-black text-emerald-950 leading-none">{listeners.total}</span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black animate-pulse border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> LIVE
                </span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pendengar Unik</p>
            <span className="text-7xl font-black text-blue-900 leading-none">{listeners.unique}</span>
          </div>

          <div className="bg-emerald-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Status Streaming</p>
            <span className="text-2xl font-black uppercase italic tracking-tighter">ONLINE</span>
            <p className="text-xs text-emerald-300/50 mt-4 font-bold tracking-tight">Server: rsm.my.id</p>
            <div className="absolute top-0 right-0 p-8 text-emerald-800/20">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
            </div>
          </div>
        </div>

        {/* SEKSI BARU: REKAPITULASI JANGKAUAN DAKWAH */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">Rekapitulasi Jangkauan</h2>
            <div className="w-full h-[1px] bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rekap Seminggu */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6">7 Hari Terakhir</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-black text-slate-900">{historyStats.weekly.total}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total Sesi Mendengarkan</p>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between">
                  <div>
                    <p className="text-lg font-black text-emerald-900">{historyStats.weekly.peak}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Puncak</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-900">{historyStats.weekly.avg}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Rerata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rekap Sebulan */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">30 Hari Terakhir</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-black text-slate-900">{historyStats.monthly.total}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total Sesi Mendengarkan</p>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between">
                  <div>
                    <p className="text-lg font-black text-blue-900">{historyStats.monthly.peak}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Puncak</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-blue-900">{historyStats.monthly.avg}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Rerata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rekap Setahun */}
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-6">Tahun 2026</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black text-emerald-950 italic tracking-tighter">{historyStats.yearly.total}</p>
                  <p className="text-[9px] font-bold text-emerald-600/60 uppercase">Total Jangkauan Dakwah</p>
                </div>
                <div className="pt-4 border-t border-emerald-100 flex justify-between">
                  <div>
                    <p className="text-xl font-black text-emerald-900">{historyStats.yearly.peak}</p>
                    <p className="text-[8px] font-bold text-emerald-600/40 uppercase">Rekor Puncak</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-900">{historyStats.yearly.avg}</p>
                    <p className="text-[8px] font-bold text-emerald-600/40 uppercase">Rerata Tahunan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Now Playing Card */}
        <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6">Sedang Mengudara</p>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 uppercase leading-tight max-w-4xl">
              {nowPlaying}
            </h2>
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Mount: /salaam</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">
            Data Source: AzuraCast API (rsm.my.id)
          </p>
          <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">
            © 2026 Radio Suara Al Muttaqin Jepara
          </p>
        </div>
      </div>
    </div>
  );
}