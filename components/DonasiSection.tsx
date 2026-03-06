"use client";

import { Copy, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

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

  // Link WhatsApp untuk konfirmasi donasi
  const waLink = "https://wa.me/6281325182875?text=Assalamualaikum,%20saya%20ingin%20konfirmasi%20donasi%20untuk%20Al%20Muttaqin.";

  return (
    <section className="py-24 bg-[#022c22] relative overflow-hidden text-white">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-800 mb-8">
          <Heart size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
            Infaq & Jariyah
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none italic">
          Dukung Dakwah <br /> <span className="text-yellow-400 font-black">Al Muttaqin Jepara</span>
        </h2>
        
        <p className="text-emerald-100/60 text-sm md:text-base max-w-3xl mx-auto mb-16 font-medium leading-relaxed uppercase tracking-widest">
          Salurkan donasi terbaik Anda untuk operasional Radio Suara Al Muttaqin dan pengembangan Pondok Pesantren melalui Baitul Maal Al Muttaqin.
        </p>

        {/* Kartu Rekening dengan Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* BSI */}
          <div className="group bg-emerald-900/20 backdrop-blur-md p-10 rounded-[3rem] border border-emerald-800/50 hover:border-emerald-500 transition-all duration-500 text-left relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
               <div className="bg-white/10 p-3 rounded-2xl">
                 {/* Pastikan logo bsi-white.png ada di folder /public/ */}
                 <Image src="/bsi-white.png" alt="BSI" width={80} height={30} className="opacity-90" />
               </div>
               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Bank Syariah Indonesia</p>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-3xl font-black tracking-widest text-white">{bsi}</h3>
              <button 
                onClick={() => copyToClipboard(bsi)}
                className="p-4 bg-emerald-800/50 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">A.N. {an}</p>
          </div>

          {/* BRI */}
          <div className="group bg-emerald-900/20 backdrop-blur-md p-10 rounded-[3rem] border border-emerald-800/50 hover:border-emerald-500 transition-all duration-500 text-left relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
               <div className="bg-white/10 p-3 rounded-2xl">
                 {/* Pastikan logo bri-white.png ada di folder /public/ */}
                 <Image src="/bri-white.png" alt="BRI" width={80} height={30} className="opacity-90" />
               </div>
               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Bank Rakyat Indonesia</p>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-3xl font-black tracking-widest text-white">{bri}</h3>
              <button 
                onClick={() => copyToClipboard(bri)}
                className="p-4 bg-emerald-800/50 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">A.N. {an}</p>
          </div>
        </div>

        {/* TOMBOL KONFIRMASI (Mengarahkan ke Admin) */}
        <div className="flex flex-col items-center gap-6">
          <a 
            href={waLink}
            target="_blank"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-emerald-950/50 active:scale-95"
          >
            <MessageCircle size={20} />
            Konfirmasi Transfer
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </a>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Jazakumullahu Khairan Katsiran
          </p>
        </div>
      </div>
    </section>
  );
}