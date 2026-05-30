import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import InfoSection from "@/components/InfoSection"; 

// Panggil komponen gabungan baru (Double Lane - Jadwal & Chat)
import RadioInteractionHub from "@/components/RadioInteractionHub";
// Tetap panggil DonasiSection dari wrapper client
import { DonasiSection } from "@/components/ClientSections"; 

// 🟢 MANTRA KEAMANAN MUTLAK: Mengunci beranda ke dinamis penuh agar lolos build Vercel tanpa drama
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* 🚀 LAYER 1: Hero Banner & Player Utama */}
      <Hero />
      
      {/* 🚀 PLAYER UTAMA: Mengatur putar/stop radio beserta visualisator spektrum canvas neon */}
      <LiveSection />

      {/* 🚀 LAYER 2: Jadwal Siaran (Kiri) & Live Chat Komunitas (Kanan) */}
      <RadioInteractionHub />

      {/* 🚀 LAYER 3: Warta/Berita Pondok Pesantren & Informasi Donasi */}
      {/* ✅ SEKARANG BERES TOTAL: Mandiri melakukan fetch otomatis ke Blogger API murni dari sisi klien */}
      <InfoSection />
      
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}