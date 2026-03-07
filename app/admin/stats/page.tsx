import Link from "next/link";
import { Users, Activity, Globe, Radio, Calendar } from "lucide-react";

export const metadata = {
  title: "Analitik Penyiaran | Radio Suara Al Muttaqin",
};

export default async function StatsPage() {
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
  const nowPlaying = radioData?.now_playing?.song?.text || "Sinyal Terputus / Maintenance";

  const historyStats = {
    weekly: { total: "1.250", peak: 45, avg: 12 },
    monthly: { total: "5.400", peak: 89, avg: 15 },
    yearly: { total: "68.200", peak: 210, avg: 18 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-0 md:p-8">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 shadow-sm">
        
        {/* TOP BAR - CLEAN & PROFESSIONAL */}
        <div className="border-b border-slate-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Analitik Penyiaran
            </h1>
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                System Active // Radio Suara Al Muttaqin
              </p>
            </div>
          </div>
          <Link 
            href="/admin" 
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-colors"
          >
            ← Kembali ke Panel
          </Link>
        </div>

        {/* REAL-TIME METRICS - REFINED SIZE */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-200">
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 group hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-slate-400">
              <Users size={16} />
              <span className="font-bold text-[10px] uppercase tracking-widest">Pendengar Live</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-slate-900">{listeners.total}</span>
              <span className="text-xs font-medium text-slate-400">User</span>
            </div>
          </div>
          
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 group hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-slate-400">
              <Globe size={16} />
              <span className="font-bold text-[10px] uppercase tracking-widest">Sesi Unik</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-slate-900">{listeners.unique}</span>
              <span className="text-xs font-medium text-slate-400">IP Aktif</span>
            </div>
          </div>

          <div className="p-8 bg-slate-50">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <Activity size={16} />
              <span className="font-bold text-[10px] uppercase tracking-widest">Status Server</span>
            </div>
            <p className="text-lg font-bold text-slate-800 tracking-tight">rsm.my.id</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Endpoint: /salaam</p>
          </div>
        </div>

        {/* DAKWAH RANGE RECAP - CLEANER GRID */}
        <div className="p-8 md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <Calendar size={16} className="text-slate-400" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Rekapitulasi Jangkauan Dakwah</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200">
            {/* WEEKLY */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-6">7 Hari Terakhir</h3>
              <p className="text-3xl font-bold tabular-nums text-slate-900 mb-1">{historyStats.weekly.total}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Total Pendengar</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.weekly.peak}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Peak</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.weekly.avg}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Average</p>
                </div>
              </div>
            </div>

            {/* MONTHLY */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-6">30 Hari Terakhir</h3>
              <p className="text-3xl font-bold tabular-nums text-slate-900 mb-1">{historyStats.monthly.total}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Total Pendengar</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.monthly.peak}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Peak</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.monthly.avg}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Average</p>
                </div>
              </div>
            </div>

            {/* YEARLY */}
            <div className="p-8 bg-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Ringkasan Tahunan</h3>
              <p className="text-3xl font-bold tabular-nums text-emerald-700 mb-1">{historyStats.yearly.total}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Estimasi Jangkauan</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.yearly.peak}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Record Peak</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{historyStats.yearly.avg}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Year Avg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NOW PLAYING - SOPHISTICATED STATUS BAR */}
        <div className="border-t border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-4 bg-emerald-50 text-emerald-600">
              <Radio size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Status Siaran Saat Ini</p>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {nowPlaying}
              </h2>
            </div>
          </div>
          <div className="hidden md:block h-12 w-px bg-slate-100" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">AzuraCast Signal</p>
            <p className="text-[9px] font-medium text-slate-400 mt-1">Bitrate: 128 kbps // MP3</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-slate-900 text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold uppercase tracking-widest">
            Data Terakhir Diperbarui: {new Date().toLocaleTimeString()}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-widest">
            © 2026 Radio Suara Al Muttaqin Media
          </p>
        </div>
      </div>
    </div>
  );
}