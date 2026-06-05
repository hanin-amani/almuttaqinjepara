"use client";

import Link from "next/link";
import { useAudio } from "@/context/AudioContext";

export default function Hero() {
  const { isPlaying, isYouTubePlaying, toggleLivePlayback } = useAudio();

  const handleListenNow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Jalankan audio secara INSTAN tanpa setTimeout agar tidak diblokir kebijakan Autoplay browser
    const isAlreadyPlaying = isPlaying || isYouTubePlaying;
    if (!isAlreadyPlaying) {
      try {
        toggleLivePlayback();
      } catch (err) {
        console.error("Gagal memicu audio langsung:", err);
      }
    }

    // 2. Lakukan navigasi scroll secara aman tanpa merusak pipeline audio
    const liveSection = document.getElementById("live");
    if (liveSection) {
      e.preventDefault();
      liveSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    /* Mengunci tinggi proporsional dan merapatkan jarak (space) dengan navbar */
    <section className="relative h-[55vh] md:h-[65vh] w-full flex items-center justify-center text-white overflow-hidden bg-emerald-950">
      
      {/* 1. Layer Gambar Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/bg-oke.jpg')" }}
      />

      {/* 2. Overlay Kontras Tinggi */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* 3. Konten Utama */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] tracking-wide">
          Radio Suara Al Muttaqin Jepara
        </h1>

        <p className="mt-4 text-lg md:text-xl text-emerald-100 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          Menginspirasi hati, menguatkan iman.
        </p>

        {/* 4. Tombol Navigasi */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="#live"
            onClick={handleListenNow}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Dengarkan Sekarang
          </Link>

          <Link
            href="/jadwal"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/60 backdrop-blur-sm text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-white hover:text-emerald-950 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/xl"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Jadwal Siaran
          </Link>
        </div>
      </div>
    </section>
  );
}