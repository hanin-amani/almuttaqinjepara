"use client";

import { Copy, Heart } from "lucide-react";

// 1. Definisikan tipe data agar TypeScript tidak marah
interface DonasiProps {
  bsi: string;
  bri: string;
  an: string;
}

export default function DonasiSection({ bsi, bri, an }: DonasiProps) {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    alert("Nomor rekening berhasil disalin!");
  };

  return (
    <section className="py-24 bg-emerald-950 relative overflow-hidden text-white">
      {/* Ornamen Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-800 mb-8">
          <Heart size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
            Infaq & Jariyah
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 leading-none">
          Dukung Dakwah <br /> <span className="text-yellow-400">Al Muttaqin Jepara</span>
        </h2>
        
        <p className="text-emerald-200/60 text-sm md:text-base max-w-2xl mx-auto mb-16 font-medium leading-relaxed uppercase tracking-wide">
          Salurkan donasi terbaik Anda untuk operasional Radio Suara Al Muttaqin dan pengembangan Pondok Pesantren melalui Baitul Maal Al Muttaqin.
        </p>

        {/* Kartu Rekening */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BSI */}
          <div className="group bg-emerald-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-emerald-800 hover:border-yellow-400/50 transition-all duration-500 text-left">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Bank Syariah Indonesia (BSI)</p>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-[0.1em]">{bsi}</h3>
              <button 
                onClick={() => copyToClipboard(bsi)}
                className="p-3 bg-emerald-800 rounded-2xl hover:bg-yellow-400 hover:text-emerald-950 transition-all shadow-lg"
                title="Salin Rekening"
              >
                <Copy size={18} />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold text-emerald-300/50 uppercase tracking-widest">A.N. {an}</p>
          </div>

          {/* BRI */}
          <div className="group bg-emerald-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-emerald-800 hover:border-yellow-400/50 transition-all duration-500 text-left">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Bank Rakyat Indonesia (BRI)</p>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-[0.1em]">{bri}</h3>
              <button 
                onClick={() => copyToClipboard(bri)}
                className="p-3 bg-emerald-800 rounded-2xl hover:bg-yellow-400 hover:text-emerald-950 transition-all shadow-lg"
                title="Salin Rekening"
              >
                <Copy size={18} />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold text-emerald-300/50 uppercase tracking-widest">A.N. {an}</p>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em]">
            Jazakumullahu Khairan Katsiran
          </p>
        </div>
      </div>
    </section>
  );
}