"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Wrapper Ikon dengan Centering Mutlak
  const BrandIcon = ({ path }: { path: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      className="w-5 h-5 fill-current" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} />
    </svg>
  );

  const socials = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      color: "bg-[#25D366]",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: "bg-[#1877F2]",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      color: "bg-[#0088cc]",
      path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z"
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`,
      color: "bg-[#bd081c]",
      // ✅ PATH BARU: Glyph 'P' yang sangat presisi & centered
      path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.132 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.033-1.002 2.324-1.492 3.121 1.12.345 2.308.531 3.538.531 6.62 0 11.987-5.367 11.987-11.987C24.01 5.362 18.638 0 12.017 0z"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 sticky top-24 left-0">
      
      {/* 🚀 GRUP MEDSOS (VERTIKAL MURNI) */}
      <div className="flex flex-col gap-3">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center ${social.color} text-white rounded-[4px] hover:scale-110 transition-all shadow-md overflow-hidden`}
            title={`Bagi ke ${social.name}`}
          >
            <BrandIcon path={social.path} />
          </a>
        ))}
      </div>

      {/* ✅ GARIS PEMISAH (HORIZONTAL KECIL) */}
      <div className="w-6 h-[1px] bg-slate-200 my-1"></div>

      {/* 🚀 TOMBOL SALIN (IDENTITAS SHARP 4PX) */}
      <button
        onClick={copyToClipboard}
        className={`w-10 h-10 flex items-center justify-center rounded-[4px] hover:scale-110 transition-all shadow-md ${
          copied ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-slate-700"
        }`}
        title="Salin Link"
      >
        {copied ? (
          <Check className="w-5 h-5 animate-in zoom-in duration-300" />
        ) : (
          <Link2 className="w-5 h-5" />
        )}
      </button>

    </div>
  );
}