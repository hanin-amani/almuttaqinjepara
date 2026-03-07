import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import LiveChat from "@/components/LiveChat"; // Import komponen chat
import ScheduleSection from "@/components/ScheduleSection"; 
import InfoSection from "@/components/InfoSection"; 
import DonasiSection from "@/components/DonasiSection";

export const dynamic = "force-dynamic";

/**
 * HOMEPAGE RADIO SUARA AL MUTTAQIN
 * Fokus: Kecepatan akses audio, interaksi jamaah, dan informasi warta terbaru.
 */
async function getLatestWarta() {
  // Mengambil 3 artikel terbaru dengan kategori terkait untuk ditampilkan di Beranda
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
      {/* 1. Header Hero: Sambutan visual utama identitas Al Muttaqin */}
      <Hero />

      {/* 2. Player Utama: Streaming Audio Radio Suara Al Muttaqin */}
      <LiveSection />

      {/* 2.5 Live Chat Section: Interaksi Real-time Jamaah (Tepat di bawah Player) */}
      <LiveChat />

      {/* 3. Jadwal Siaran: Program harian siaran santri */}
      <ScheduleSection /> 
      
      {/* 4. Warta Pondok: Muncul di bawah Schedule, menampilkan Kabar Pondok & Materi Khutbah */}
      <InfoSection articles={latestWarta} />
      
      {/* 5. Sesi Donasi: Informasi Infaq & Jariyah Baitul Maal Al Muttaqin */}
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}