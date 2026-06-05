"use client";

import Link from "next/link";
import { useAudio } from "@/context/AudioContext";

export default function Hero() {
  const { isPlaying, isYouTubePlaying, toggleLivePlayback } = useAudio();

  const handleListenNow = () => {
    const isAlreadyPlaying = isPlaying || isYouTubePlaying;

    if (!isAlreadyPlaying) {
      toggleLivePlayback();
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
      {/* 1. Layer Gambar Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/bg-oke.jpg')" }}
      />

      {/* 2. Overlay Minimalis */}
      <div className="absolute inset-0 z-10 bg-black/10" />

      {/* 3. Konten Utama */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          Radio Suara Al Muttaqin Jepara
        </h1>

        <p className="mt-6 text-xl text-emerald-50 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          Menginspirasi hati, menguatkan iman.
        </p>

        {/* 4. Tombol Navigasi */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <Link
            href="#live"
            onClick={handleListenNow}
            className="group flex items-center justify-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-emerald-600"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Dengarkan Sekarang
          </Link>

          <Link
            href="/jadwal"
            className="group flex items-center justify-center gap-2 border-2 border-white/50 backdrop-blur-sm px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-emerald-900 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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