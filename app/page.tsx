import dynamic from "next/dynamic"; // 1. Import dynamic untuk Lazy Loading
import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import ScheduleSection from "@/components/ScheduleSection"; 
import InfoSection from "@/components/InfoSection"; 

// 2. Dynamic Import untuk komponen berat agar tidak membebani First Load
const LiveChat = dynamic(() => import("@/components/LiveChat"), { 
  ssr: false,
  loading: () => <div className="h-40 animate-pulse bg-slate-50 rounded-3xl mx-auto max-w-6xl my-10" /> 
});

const DonasiSection = dynamic(() => import("@/components/DonasiSection"), { 
  ssr: false 
});

export const dynamic = "force-dynamic";

/**
 * HOMEPAGE RADIO SUARA AL MUTTAQIN
 * Optimasi: Lazy Loading & Server-Side Data Fetching
 */
async function getLatestWarta() {
  return await prisma.info.findMany({
    where: { 
      status: "publish", 
      is_active: true 
    },
    orderBy: { 
      created_at: "desc" 
    },
    take: 3,
    include: { 
      category: true 
    }
  });
}

export default async function Home() {
  const latestWarta = await getLatestWarta();

  return (
    <main className="relative min-h-screen bg-white">
      {/* 1. HERO: Pastikan di dalam komponen ini, gambar utama menggunakan priority={true} */}
      <Hero />

      {/* 2. PLAYER: Komponen inti siaran */}
      <LiveSection />

      {/* 3. LIVE CHAT: Sekarang dimuat secara Lazy Load (Skor Performa naik) */}
      <LiveChat />

      {/* 4. JADWAL: Informasi program harian */}
      <ScheduleSection /> 
      
      {/* 5. WARTA PONDOK: Kabar terbaru Pesantren Al Muttaqin */}
      <InfoSection articles={latestWarta} />
      
      {/* 6. DONASI: Informasi Infaq (Lazy Loaded) */}
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}