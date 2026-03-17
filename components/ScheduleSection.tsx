"use client";
import { useEffect, useState, useCallback } from "react";
import { Clock, Radio, Zap } from "lucide-react";

export default function ScheduleSection() {
  const [currentPlaylist, setCurrentPlaylist] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const syncWithAzura = useCallback(async () => {
    try {
      // ✅ Panggil API internal, bukan rsm.my.id langsung (Fix CORS)
      const response = await fetch("/api/nowplaying", { cache: "no-store" });
      const data = await response.json();
      
      const apiData = Array.isArray(data) ? data[0] : data;
      const playlistName = apiData?.now_playing?.playlist || "";
      setCurrentPlaylist(playlistName);
    } catch (error) {
      console.error("Gagal sinkron:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithAzura();
    const interval = setInterval(syncWithAzura, 30000); 
    return () => clearInterval(interval);
  }, [syncWithAzura]);

  const scheduleData = [
    { time: "06:00 - 07:00", title: "Nasyid Pagi", icon: "☀️" },
    { time: "07:00 - 09:00", title: "Taujih Pagi Ust. Sartono", icon: "📖" },
    { time: "10:00 - 11:00", title: "Kajian Keluarga Sakinah", icon: "🏠" },
    { time: "13:00 - 14:00", title: "Kajian Tematik", icon: "💡" },
    { time: "16:00 - 17:00", title: "Taujih Sore Ust. Sartono", icon: "🌇" },
    { time: "17:00 - 19:30", title: "Murottal Anak", icon: "🌙" },
    { time: "19:30 - 21:00", title: "Tazkiyatun Nafs", icon: "💎" },
    { time: "21:00 - 22:00", title: "Kajian Parenting", icon: "👨‍👩‍👧" },
    { time: "22:00 - 23:00", title: "Nasyid Lawas", icon: "🎵" },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* HEADER SHARP */}
        <div className="text-left mb-12 border-l-8 border-emerald-600 pl-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
            Jadwal <span className="text-emerald-600">Siaran Rutin</span>
          </h2>
          <p className="mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            Radio Suara Al Muttaqin • Menginspirasi Hati Menguatkan Iman
          </p>
        </div>

        <div className="grid gap-3">
          {scheduleData.map((prog, index) => {
            const isLive = currentPlaylist.toLowerCase().includes(prog.title.toLowerCase());

            return (
              <div 
                key={index}
                className={`group relative border transition-all duration-300 rounded-[4px] ${
                  isLive 
                  ? "bg-emerald-600 border-emerald-400 shadow-xl scale-[1.01] z-10" 
                  : "bg-slate-50 border-slate-100 hover:bg-white hover:border-emerald-200"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:p-6">
                  
                  <div className="flex items-center gap-6 w-full">
                    {/* ICON BOX - Sharp 4px */}
                    <div className={`flex shrink-0 items-center justify-center w-14 h-14 rounded-[4px] border transition-all ${
                      isLive ? "bg-white text-emerald-600 border-white" : "bg-white text-slate-300 border-slate-100 shadow-sm"
                    }`}>
                      <span className="text-xl">{prog.icon}</span>
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isLive ? "text-emerald-100" : "text-slate-400"}`}>
                          <Clock size={10} className="inline mr-1" /> {prog.time}
                        </span>
                        {isLive && (
                          <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-[2px] animate-pulse uppercase">Live</span>
                        )}
                      </div>
                      <h3 className={`text-lg md:text-xl font-black uppercase italic tracking-tight leading-none mt-1 ${
                        isLive ? "text-white" : "text-slate-700"
                      }`}>
                        {prog.title}
                      </h3>
                    </div>
                  </div>

                  {/* STATUS SIGNAL */}
                  <div className="hidden md:flex items-center gap-4 shrink-0">
                    {isLive ? (
                      <div className="flex items-center gap-2 bg-emerald-950/20 px-4 py-2 rounded-[2px] border border-white/20">
                        <Zap size={14} className="text-yellow-400 animate-bounce" />
                        <span className="text-[10px] font-black text-white uppercase italic">Active Signal</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-emerald-300 transition-colors">
                        Ready to Air
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-left">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] border-t border-slate-50 pt-6">
            © 2026 Radio Suara Al Muttaqin Jepara • Automated Sync Active
          </p>
        </div>
      </div>
    </section>
  );
}