"use client";

import { SessionProvider } from "next-auth/react";
import { AudioProvider } from "@/context/AudioContext";

/**
 * Providers Component
 * Tempat berkumpulnya semua context provider agar layout.tsx tetap bersih
 * dan semua komponen (Client/Server) bisa mengakses session & audio.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AudioProvider>
        {/* Semua komponen di dalam children sekarang punya akses ke:
           1. useSession() -> Untuk login/auth
           2. useAudio()   -> Untuk player radio
        */}
        {children}
      </AudioProvider>
    </SessionProvider>
  );
}