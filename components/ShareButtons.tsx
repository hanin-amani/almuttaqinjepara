"use client";

import { useState } from "react";
// Impor icon fungsional dari Lucide
import { Link2, Check } from "lucide-react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const shareText = encodeURIComponent(title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    // Tampilkan status tersalin selama 2 detik
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
      
      {/* Tombol Facebook - Hijau Al Muttaqin hover */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:scale-110 hover:bg-emerald-600 transition-all shadow-lg"
        title="Bagi ke Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-5 h-5 text-white">
          <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
        </svg>
      </a>

      {/* Tombol WhatsApp - Hijau Al Muttaqin hover */}
      <a
        href={`https://wa.me/?text=${shareText}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-full hover:scale-110 hover:bg-emerald-600 transition-all shadow-lg"
        title="Bagi ke WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 text-white">
          <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32C100.3 32 0 132.3 0 255.9c0 39.4 10.3 77.8 29.7 111.3L0 512l146.4-38.4c32.2 17.6 68.2 26.8 105.3 26.8h.1c123.4 0 223.7-100.3 223.7-223.8c0-59.8-23.2-116.1-65.2-158.1z"/>
        </svg>
      </a>

      {/* Tombol Telegram - Hijau Al Muttaqin hover */}
      <a
        href={`https://t.me/share/url?url=${url}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#0088cc] text-white rounded-full hover:scale-110 hover:bg-emerald-600 transition-all shadow-lg"
        title="Bagi ke Telegram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-5 h-5 text-white">
          <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62.1-45.8-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4.1 20.7 2.5 16.9 20z"/>
        </svg>
      </a>

      {/* Tombol Pinterest - Hijau Al Muttaqin hover */}
      <a
        href={`https://pinterest.com/pin/create/button/?url=${url}&description=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#bd081c] text-white rounded-full hover:scale-110 hover:bg-emerald-600 transition-all shadow-lg"
        title="Bagi ke Pinterest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-5 h-5 text-white">
          <path fill="currentColor" d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 312 60.8 312c12.1 0 12.1-57.6 3.3-81.7-18.6-61.3 23.6-134 140.3-134 112.8 0 116.8 116.8 116.8 180.8 0 87.1-11.2 169.6-104 169.6-43.6 0-55.2-19.9-55.2-19.9l-20 81.3c-18.6 74.9-63.1 154-63.1 154-1.1 0-1.1 0 0 0 101.6-4.7 129.2-123.1 137.7-178.4 10.9 19.9 42.4 19.9 42.4 19.9 110.1 0 119.9-116.8 119.9-116.8 0-110.1-84.3-185.6-180.8-185.6z"/>
        </svg>
      </a>
      
      {/* Tombol Salin Link - Ukuran sama dengan medsos */}
      <button
        onClick={copyToClipboard}
        className={`w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all shadow-lg ${
          copied ? "bg-emerald-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
        }`}
        title={copied ? "Tersalin!" : "Salin Link Artikel"}
      >
        {copied ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <Link2 className="w-5 h-5 text-white" />
        )}
      </button>

    </div>
  );
}