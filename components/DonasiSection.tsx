"use client";
import React, { useState } from "react";

export default function DonasiSection() {
  const [copiedBSI, setCopiedBSI] = useState(false);
  const [copiedBRI, setCopiedBRI] = useState(false);

  const waNumber = "6281325182875";
  const waLink = `https://wa.me/${waNumber}?text=Assalamu'alaikum,%20saya%20ingin%20konfirmasi%20transfer%20donasi%20untuk%20Baitul%20Maal%20Al%20Muttaqin.`;

  const bankDetails = {
    bsi: {
      name: "BANK SYARIAH INDONESIA (BSI)",
      norek: "7120202043",
      logo: "/bsi.png",
      an: "BAITUL MAAL AL MUTTAQIN",
    },
    bri: {
      name: "BANK RAKYAT INDONESIA (BRI)",
      norek: "0022 01 028443 53 3",
      logo: "/bri.png",
      an: "BAITUL MAAL AL MUTTAQIN",
    }
  };

  const handleCopy = (norek: string, type: "bsi" | "bri") => {
    navigator.clipboard.writeText(norek.replace(/\s/g, ''));
    if (type === "bsi") {
      setCopiedBSI(true);
      setTimeout(() => setCopiedBSI(false), 2000);
    } else {
      setCopiedBRI(true);
      setTimeout(() => setCopiedBRI(false), 2000);
    }
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-emerald-950">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Amal <span className="text-emerald-400">Jariyah</span>
          </h2>
          <div className="h-1.5 w-20 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          
          <p className="mt-8 text-emerald-100/70 max-w-3xl mx-auto text-lg leading-relaxed">
            Dukung perjuangan para pencari ilmu di **Pondok Pesantren Islam Al Muttaqin**. 
            Setiap rupiah bantuan Anda adalah investasi abadi untuk melahirkan generasi Robbani.
          </p>
        </div>

        {/* Grid Kartu Rekening */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {/* Kartu BSI */}
            <div className="bg-emerald-900/40 backdrop-blur-md border border-white/5 p-7 rounded-3xl shadow-xl flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                  <img src={bankDetails.bsi.logo} alt="BSI" className="w-full h-auto object-contain" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-base leading-tight">Layanan Donasi</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{bankDetails.bsi.name}</p>
                </div>
              </div>

              <div className="bg-black/30 p-5 rounded-2xl border border-emerald-500/20 flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-1">Nomor Rekening</p>
                  <p className="text-2xl font-mono text-white font-bold tracking-tight">{bankDetails.bsi.norek}</p>
                  <p className="text-emerald-100/40 text-[10px] mt-1 uppercase font-bold tracking-wide">a.n {bankDetails.bsi.an}</p>
                </div>
                <button 
                  onClick={() => handleCopy(bankDetails.bsi.norek, "bsi")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 p-3 rounded-xl transition-all active:scale-90 shadow-lg"
                >
                  {copiedBSI ? "✅" : "📋"}
                </button>
              </div>
              {copiedBSI && <p className="text-emerald-400 text-[10px] mt-2 font-bold animate-pulse text-left uppercase tracking-widest">Berhasil disalin!</p>}
            </div>

            {/* Kartu BRI */}
            <div className="bg-emerald-900/40 backdrop-blur-md border border-white/5 p-7 rounded-3xl shadow-xl flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                  <img src={bankDetails.bri.logo} alt="BRI" className="w-full h-auto object-contain" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-base leading-tight">Layanan Donasi</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{bankDetails.bri.name}</p>
                </div>
              </div>

              <div className="bg-black/30 p-5 rounded-2xl border border-emerald-500/20 flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-1">Nomor Rekening</p>
                  <p className="text-2xl font-mono text-white font-bold tracking-tight">{bankDetails.bri.norek}</p>
                  <p className="text-emerald-100/40 text-[10px] mt-1 uppercase font-bold tracking-wide">a.n {bankDetails.bri.an}</p>
                </div>
                <button 
                  onClick={() => handleCopy(bankDetails.bri.norek, "bri")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 p-3 rounded-xl transition-all active:scale-90 shadow-lg"
                >
                  {copiedBRI ? "✅" : "📋"}
                </button>
              </div>
              {copiedBRI && <p className="text-emerald-400 text-[10px] mt-2 font-bold animate-pulse text-left uppercase tracking-widest">Berhasil disalin!</p>}
            </div>
          </div>

          {/* Sisi Kanan: Konfirmasi & Alokasi */}
          <div className="text-left space-y-6 lg:pl-4">
            <h4 className="text-white font-black text-2xl italic uppercase tracking-tighter">Alokasi <span className="text-emerald-400">Donasi</span></h4>
            
            <div className="space-y-4">
              {[
                "Fasilitas Asrama & Konsumsi Santri", 
                "Pembangunan Sarana Belajar", 
                "Beasiswa Santri Yatim & Dhuafa"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-emerald-50 text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>

            {/* TOMBOL KUNING MODEREN */}
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-emerald-950 px-8 py-5 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(234,179,8,0.2)] transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
            >
              Konfirmasi Transfer
            </a>
            <p className="text-[10px] text-emerald-100/40 text-center uppercase font-bold tracking-[0.2em]">WhatsApp: +62 813-2518-2875</p>
          </div>

        </div>

        {/* Footer Hadits */}
        <div className="mt-20 py-8 border-t border-white/5 text-center">
          <p className="text-emerald-100/40 text-[11px] leading-relaxed italic max-w-2xl mx-auto uppercase tracking-widest font-medium">
            "Sedekah jariyah, ilmu yang bermanfaat, atau anak sholeh yang mendoakannya." (HR. Muslim)
          </p>
        </div>
      </div>
    </section>
  );
}