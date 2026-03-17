import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import InfoSection from "@/components/InfoSection"; 

// 1. Panggil komponen gabungan baru (Double Lane)
import RadioInteractionHub from "@/components/RadioInteractionHub";
// 2. Tetap panggil DonasiSection dari wrapper client
import { DonasiSection } from "@/components/ClientSections"; 

export const revalidate = 60; 

async function getLatestWarta() {
  try {
    return await prisma.info.findMany({
      where: { 
        // ✅ GANTI DISINI: Gunakan OR agar status "publish" atau "published" tetap kena gank
        OR: [
          { status: "published" },
          { status: "publish" }
        ],
        // ✅ PASTIKAN INI: Jika di schema ada is_active, pastikan nilainya true
        is_active: true 
      }, 
      orderBy: { created_at: "desc" },
      take: 4,
      include: { category: true }
    });
  } catch (error) {
    console.error("Gagal farming data warta:", error);
    return []; // Return array kosong jika error agar tidak crash
  }
}

export default async function Home() {
  const latestWarta = await getLatestWarta();

  return (
    <main className="relative min-h-screen bg-white">
      {/* 🚀 LAYER 1: Hero & Player */}
      <Hero />
      <LiveSection />

      {/* 🚀 LAYER 2: Jadwal & Live Chat (Sejajar) */}
      <RadioInteractionHub />

      {/* 🚀 LAYER 3: Berita & Donasi */}
      {/* Jika data ada, tampilkan. Jika kosong, InfoSection harus punya handle empty state */}
      <InfoSection articles={latestWarta} />
      
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}