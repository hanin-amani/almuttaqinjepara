import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import ScheduleSection from "@/components/ScheduleSection"; 
import InfoSection from "@/components/InfoSection"; 

// 2. Import komponen dari wrapper client
import { LiveChat, DonasiSection } from "@/components/ClientSections"; 

/**
 * HOMEPAGE RADIO SUARA AL MUTTAQIN
 * Optimasi: ISR (60 detik) untuk kecepatan maksimal
 */
export const revalidate = 60; 

async function getLatestWarta() {
  return await prisma.info.findMany({
    where: { status: "publish", is_active: true },
    orderBy: { created_at: "desc" },
    take: 3,
    include: { category: true }
  });
}

export default async function Home() {
  const latestWarta = await getLatestWarta();

  return (
    <main className="relative min-h-screen bg-white">
      {/* Hero & LiveSection tetap di server untuk LCP cepat */}
      <Hero />
      <LiveSection />

      {/* Komponen interaktif dimuat secara dinamis di client */}
      <LiveChat />

      <ScheduleSection /> 
      <InfoSection articles={latestWarta} />
      
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}