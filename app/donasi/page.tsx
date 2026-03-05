"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function DonasiPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const bankAccounts = [
    {
      bank: "BSI (BANK SYARIAH INDONESIA)",
      number: "7120202043",
      name: "BAITUL MAAL AL MUTTAQIN",
      logo: "/bsi.png"
    },
    {
      bank: "BANK BRI",
      number: "0022 01 028443 53 3",
      name: "BAITUL MAAL AL MUTTAQIN",
      logo: "/bri.png"
    }
  ];

  const waNumber = "6281325182875";
  const waLink = `https://wa.me/${waNumber}?text=Assalamu'alaikum,%20saya%20ingin%20konfirmasi%20transfer%20donasi%20untuk%20Baitul%20Maal%20Al%20Muttaqin.`;

  const handleCopy = (num: string) => {
    // Menghapus spasi untuk kemudahan copy-paste ke aplikasi bank
    navigator.clipboard.writeText(num.replace(/\s/g, ''));
    setCopied(num);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 relative overflow-hidden">
      
      {/* 1. Header Section - Solid & Clean */}
      <div className="relative bg-emerald-950 pt-32 pb-44 px-6 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            INVESTASI <span className="text-yellow-400">ABADI</span>
          </h1>
          <div className="h-2 w-32 bg-yellow-400 mx-auto mt-6 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.7)]" />
          
          <p className="mt-10 text-emerald-50 max-w-2xl mx-auto text-lg md:text-xl font-bold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Dukung perjuangan para pencari ilmu di <span className="text-white underline decoration-yellow-400 decoration-4 underline-offset-8">"Pondok Pesantren Islam Al Muttaqin"</span>. 
            Setiap bantuan Anda adalah jariyah untuk melahirkan generasi Robbani.
          </p>
        </div>
      </div>

      {/* 2. Area Konten Utama */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 -mt-20">
        <div className="grid lg:grid-cols-3 gap-10 md:gap-14">
          
          {/* Kolom Kiri: Pilih Rekening */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-10 h-10 bg-white text-emerald-900 font-black rounded-xl shadow-lg border border-emerald-50">1</span>
              <h3 className="text-xl font-black text-white md:text-emerald-950 tracking-tight drop-shadow-sm md:drop-shadow-none">Pilih Rekening Transfer</h3>
            </div>
            
            <div className="space-y-6">
              {bankAccounts.map((acc) => (
                <div 
                  key={acc.number}
                  className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-8"
                >
                  <div className="flex items-center gap-8 flex-1">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner border border-slate-100 overflow-hidden">
                      <img src={acc.logo} alt={acc.bank} className="w-full h-auto object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1">{acc.bank}</p>
                      <p className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{acc.number}</p>
                      <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-tight">a.n {acc.name}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy(acc.number)}
                    className="w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:translate-y-1 active:shadow-none border-b-4 border-slate-700 hover:border-emerald-800 flex items-center justify-center gap-2"
                  >
                    {copied === acc.number ? "✅ BERHASIL DISALIN" : "📋 SALIN REKENING"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Konfirmasi & Alokasi */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-10 h-10 bg-white text-emerald-900 font-black rounded-xl shadow-lg border border-emerald-50">2</span>
              <h3 className="text-xl font-black text-white md:text-emerald-950 tracking-tight drop-shadow-sm md:drop-shadow-none">Konfirmasi</h3>
            </div>

            <div className="bg-emerald-950 p-10 rounded-3xl text-white shadow-3xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10 text-left">
                <h4 className="text-2xl font-black mb-6 italic tracking-tight uppercase">Sudah Transfer?</h4>
                
                {/* Daftar Alokasi Donasi */}
                <div className="mb-10 space-y-4">
                  <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2">Alokasi Donasi:</p>
                  {[
                    "Fasilitas Asrama & Konsumsi Santri",
                    "Pembangunan Sarana Belajar",
                    "Beasiswa Santri Yatim & Dhuafa"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></div>
                      <p className="text-emerald-50 text-xs font-semibold leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={waLink} 
                  target="_blank"
                  className="block w-full bg-yellow-400 hover:bg-yellow-300 text-emerald-950 text-center py-5 rounded-xl font-black uppercase tracking-widest shadow-[0_8px_0_rgb(202,138,4)] active:translate-y-1 active:shadow-none transition-all transform hover:-translate-y-0.5"
                >
                  Konfirmasi via WA
                </Link>
              </div>
            </div>
            
            <p className="px-6 text-xs text-slate-400 italic text-center leading-relaxed">
              Setiap donasi yang masuk akan langsung dikelola oleh bendahara Baitul Maal Al Muttaqin.
            </p>
          </div>
        </div>

        {/* Jaringan Media */}
        <div className="mt-24 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Mitra Media Resmi</p>
          <Link 
            href="https://onislam.web.id" 
            target="_blank" 
            className="inline-flex items-center gap-3 px-10 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-all shadow-sm group active:scale-95"
          >
            <span className="text-slate-500 group-hover:text-emerald-600 font-black text-[11px] uppercase tracking-widest transition-colors italic">OnIslam.web.id</span>
          </Link>
        </div>
      </div>
    </div>
  );
}