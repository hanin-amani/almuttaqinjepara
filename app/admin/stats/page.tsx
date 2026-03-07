import Link from "next/link";

export const metadata = {
  title: "DATA ANALYTICS | Radio Al Muttaqin",
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
  const nowPlaying = radioData?.now_playing?.song?.text || "OFFLINE / MAINTENANCE";

  const historyStats = {
    weekly: { total: 1250, peak: 45, avg: 12 },
    monthly: { total: 5400, peak: 89, avg: 15 },
    yearly: { total: 68200, peak: 210, avg: 18 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-0 md:p-10">
      <div className="max-w-7xl mx-auto border-x border-slate-200 bg-white min-h-screen shadow-2xl shadow-slate-200/50">
        
        {/* TOP BAR - SHARP & BOLD */}
        <div className="border-b-4 border-emerald-950 flex flex-col md:flex-row items-stretch">
          <div className="bg-emerald-950 text-white p-8 md:p-12 flex-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              DASHBOARD <br />
              <span className="text-emerald-400">ANALYTICS</span>
            </h1>
            <p className="mt-4 text-emerald-500/80 font-mono text-xs uppercase tracking-[0.4em] font-bold">
              Radio Suara Al Muttaqin // Jepara, Central Java
            </p>
          </div>
          <div className="border-l-0 md:border-l border-emerald-900 flex items-center justify-center p-8 bg-white">
            <Link 
              href="/admin" 
              className="group relative px-10 py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-colors rounded-none"
            >
              <span className="relative z-10">← BACK TO TERMINAL</span>
            </Link>
          </div>
        </div>

        {/* REAL-TIME METRICS - BRUTALIST BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-200">
          <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-emerald-50/30 transition-colors">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">LIVE_LISTENERS</p>
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-black leading-none tracking-tighter tabular-nums text-emerald-950">
                {listeners.total}
              </span>
              <span className="text-emerald-500 font-black text-xs animate-pulse tracking-widest">● LIVE</span>
            </div>
          </div>
          
          <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-blue-50/30 transition-colors">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">UNIQUE_SESSIONS</p>
            <span className="text-8xl font-black leading-none tracking-tighter tabular-nums text-blue-900">
              {listeners.unique}
            </span>
          </div>

          <div className="p-10 bg-slate-900 text-white">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">SERVER_STATUS</p>
            <div className="space-y-2">
              <p className="text-3xl font-black italic tracking-tighter uppercase">rsm.my.id</p>
              <div className="h-1 w-full bg-emerald-900">
                <div className="h-full bg-emerald-400 w-full animate-pulse"></div>
              </div>
              <p className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest mt-2">Protocol: Liquidsoap // /salaam</p>
            </div>
          </div>
        </div>

        {/* DAKWAH RANGE RECAP - GRID NO ROUNDS */}
        <div className="p-10 md:p-16 border-b border-slate-200">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">DAKWAH_RECAP_2026</h2>
            <div className="h-px flex-1 bg-slate-100 ml-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200">
            {/* WEEKLY */}
            <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-8 border-l-4 border-emerald-600 pl-4">Last 7 Days</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-5xl font-black tabular-nums tracking-tighter">{historyStats.weekly.total}</p>
                  <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Total Listeners</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 font-mono">
                  <div>
                    <p className="font-black text-slate-900">{historyStats.weekly.peak}</p>
                    <p className="text-[8px] text-slate-400 uppercase">Peak</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{historyStats.weekly.avg}</p>
                    <p className="text-[8px] text-slate-400 uppercase">Avg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MONTHLY */}
            <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-8 border-l-4 border-blue-600 pl-4">Last 30 Days</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-5xl font-black tabular-nums tracking-tighter">{historyStats.monthly.total}</p>
                  <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Total Listeners</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 font-mono">
                  <div>
                    <p className="font-black text-slate-900">{historyStats.monthly.peak}</p>
                    <p className="text-[8px] text-slate-400 uppercase">Peak</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{historyStats.monthly.avg}</p>
                    <p className="text-[8px] text-slate-400 uppercase">Avg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* YEARLY */}
            <div className="p-10 bg-emerald-50">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-900 mb-8 border-l-4 border-emerald-950 pl-4">Yearly Summary</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-6xl font-black italic tracking-tighter text-emerald-950">{historyStats.yearly.total}</p>
                  <p className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest mt-1">Dakwah Reach</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-200 font-mono">
                  <div>
                    <p className="font-black text-emerald-900">{historyStats.yearly.peak}</p>
                    <p className="text-[8px] text-emerald-700 uppercase">Peak Record</p>
                  </div>
                  <div>
                    <p className="font-black text-emerald-900">{historyStats.yearly.avg}</p>
                    <p className="text-[8px] text-emerald-700 uppercase">Year Avg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NOW PLAYING - FULL WIDTH BLACK BLOCK */}
        <div className="bg-slate-950 text-white p-12 md:p-20 relative overflow-hidden border-t-8 border-emerald-400">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-emerald-400"></span>
              <p className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-[0.5em]">SIGNAL_ON_AIR</p>
            </div>
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.9] uppercase max-w-5xl">
              {nowPlaying}
            </h2>
          </div>
          {/* Background Matrix-like Ornament */}
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none font-mono text-[10px] leading-none overflow-hidden select-none">
            {Array(50).fill("SUARA_AL_MUTTAQIIN_JEPARA_").map((t, i) => (
              <div key={i} className="whitespace-nowrap">{t.repeat(10)}</div>
            ))}
          </div>
        </div>

        {/* FOOTER DATA SOURCE */}
        <div className="p-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white font-mono">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">
            SOURCE_INTEL: AZURACAST_API_03.07.2026
          </p>
          <div className="flex gap-8">
            <span className="text-emerald-600 text-[9px] font-black uppercase tracking-widest italic tracking-[0.3em]">
              © AL_MUTTAQIN_MEDIA_NETWORK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}